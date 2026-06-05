// ══════════════════════════════════════════════════════════════
// 台股 API 中間層 v5
// 上市(TWSE) + 上櫃(TPEx) + 個股歷史K線
// 不需要 API Key，完全免費
// ══════════════════════════════════════════════════════════════

const OTC_STOCKS = new Set([
  '3529','8016','6462','3035','6643','3545','3041','2436','2458',
  '6202','3094','6411','6291','4968','3530','8081','3227','5269',
  '4966','6104','4919','3583','3131','3680','6488','3016','6509',
  '6510','3289','3587','6830','6217','3563','3264','6414','3324',
  '6282','8291','5349','6269','8039','3022','6245','3596','5469',
  '3715','3374','3189','4958','7769','3491','3152','3138','6568',
  '3305','6127','6152','4916','6706','6442','7717','6979','6413',
  '6274','6213','4909','3017','3653','3576','3533','6147','3030',
  '3023','6190','3665','3501','4572','8222','5284','5009','3490',
  '8033','3552','6235','4551','4529','6863','4934','3691','2243',
  '1568','3707','6806','3708','6869','8996','8936','1589','6793',
  '6873','1529','6477','3686','8104','5309','6441','3714','5274',
  '3661','8086','5222','3105','3081','6285','5388','3062','3380',
  '6414','2464',
]);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, stock } = req.query;

  // ── 個股歷史K線（近60交易日）────────────────────────────
  if (type === 'history' && stock) {
    try {
      const isOTC = OTC_STOCKS.has(stock);
      const today = new Date();
      const results = [];

      // 抓最近2個月資料（確保有足夠交易日）
      for (let m = 0; m <= 1; m++) {
        const d = new Date(today.getFullYear(), today.getMonth() - m, 1);
        const yyyymm = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}`;
        const yyyymmdd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}01`;

        let url, rows = [];
        if (isOTC) {
          // 上櫃：TPEx
          url = `https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_info/st43_download.php?l=zh-tw&d=${yyyymm}&stkno=${stock}&s=0,asc,0&o=json`;
        } else {
          // 上市：TWSE
          url = `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${yyyymmdd}&stockNo=${stock}`;
        }

        const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!r.ok) continue;
        const data = await r.json();

        if (!isOTC && data.stat === 'OK' && Array.isArray(data.data)) {
          // TWSE 格式：[日期, 成交股數, 成交金額, 開盤, 最高, 最低, 收盤, 漲跌, 筆數]
          data.data.forEach(row => {
            const dateStr = row[0]; // e.g. "115/04/01"
            const [y, mo, dd] = dateStr.split('/');
            const year = parseInt(y) + 1911;
            const dateFormatted = `${year}/${mo}/${dd}`;
            const open  = parseFloat(row[3]?.replace(/,/g,'')) || 0;
            const high  = parseFloat(row[4]?.replace(/,/g,'')) || 0;
            const low   = parseFloat(row[5]?.replace(/,/g,'')) || 0;
            const close = parseFloat(row[6]?.replace(/,/g,'')) || 0;
            const vol   = Math.round(parseInt(row[1]?.replace(/,/g,'') || '0') / 1000);
            if (close > 0) rows.push({ date: dateFormatted, open, high, low, close, vol });
          });
        } else if (isOTC && data.iTotalRecords > 0 && Array.isArray(data.aaData)) {
          // TPEx 格式
          data.aaData.forEach(row => {
            const dateStr = row[0]; // e.g. "115/04/01"
            const [y, mo, dd] = dateStr.split('/');
            const year = parseInt(y) + 1911;
            const dateFormatted = `${year}/${mo}/${dd}`;
            const open  = parseFloat(row[4]?.replace(/,/g,'')) || 0;
            const high  = parseFloat(row[5]?.replace(/,/g,'')) || 0;
            const low   = parseFloat(row[6]?.replace(/,/g,'')) || 0;
            const close = parseFloat(row[2]?.replace(/,/g,'')) || 0;
            const vol   = Math.round(parseInt(row[1]?.replace(/,/g,'') || '0') / 1000);
            if (close > 0) rows.push({ date: dateFormatted, open, high, low, close, vol });
          });
        }
        results.push(...rows);
      }

      // 排序由舊到新，取最近60筆
      results.sort((a, b) => a.date.localeCompare(b.date));
      const recent = results.slice(-60);

      return res.status(200).json({ stock, data: recent, count: recent.length });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── 即時股價（盤中）────────────────────────────────────────
  if (type === 'realtime') {
    try {
      const stocks = (req.query.stocks || '').split(',').filter(Boolean);
      const tseList = stocks.filter(s => !OTC_STOCKS.has(s)).map(s => `tse_${s}.tw`);
      const otcList = stocks.filter(s =>  OTC_STOCKS.has(s)).map(s => `otc_${s}.tw`);
      const allList = [...tseList, ...otcList].join('|');
      if (!allList) return res.status(400).json({ error: 'No stocks' });

      const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${allList}&json=1&delay=0&_=${Date.now()}`;
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const data = await r.json();

      const formatted = {};
      (data?.msgArray || []).forEach(s => {
        const price = parseFloat(s.z !== '-' ? s.z : s.y) || 0;
        const prev  = parseFloat(s.y) || 0;
        const ch    = prev > 0 ? +((price - prev) / prev * 100).toFixed(2) : 0;
        formatted[s.c] = { p: price, ch, vol: parseInt(s.v || '0'), name: s.n };
      });
      return res.status(200).json({ source: 'realtime', data: formatted });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── 盤後全市場收盤價（每天 15:30 後更新）──────────────────
  try {
    const formatted = {};
    let dataDate = '';

    // 1. TWSE 上市盤後
    const twseRes = await fetch('https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL', {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    if (twseRes.ok) {
      const twseData = await twseRes.json();
      if (Array.isArray(twseData) && twseData.length > 0) {
        // 取資料日期（從第一筆推算）
        const today = new Date();
        dataDate = today.toLocaleDateString('zh-TW');

        twseData.forEach(s => {
          const price  = parseFloat(s.ClosingPrice?.replace(/,/g,'')) || 0;
          const change = parseFloat((s.Change||'0').replace(/,/g,'').replace(/^[+]/,'')) || 0;
          const prev   = price - change;
          const ch     = prev > 0 ? +((change / prev) * 100).toFixed(2) : 0;
          const vol    = Math.round(parseInt(s.TradeVolume?.replace(/,/g,'') || '0') / 1000);
          if (price > 0) formatted[s.Code] = { p: price, ch, vol, name: s.Name };
        });
      }
    }

    // 2. TPEx 上櫃盤後
    const tpexRes = await fetch('https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes', {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    if (tpexRes.ok) {
      const tpexData = await tpexRes.json();
      if (Array.isArray(tpexData)) {
        tpexData.forEach(s => {
          const code  = s.SecuritiesCompanyCode || s.Code;
          const price = parseFloat(s.Close?.replace(/,/g,'')) || 0;
          const change = parseFloat((s.Change||'0').replace(/,/g,'').replace(/^[+]/,'')) || 0;
          const prev  = price - change;
          const ch    = prev > 0 ? +((change / prev) * 100).toFixed(2) : 0;
          const vol   = Math.round(parseInt((s.TradingShares||'0').replace(/,/g,'')) / 1000);
          if (code && price > 0) formatted[code] = { p: price, ch, vol, name: s.CompanyName || '' };
        });
      }
    }

    const total = Object.keys(formatted).length;
    if (total < 50) {
      return res.status(503).json({ error: 'Market data not yet available (before 15:30)', total });
    }

    return res.status(200).json({ source: 'aftermarket', dataDate, total, data: formatted });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ══════════════════════════════════════════════════════
// 台股即時/盤後 API 中間層
// 上市(TWSE) + 上櫃(TPEx) 合併支援
// 不需要任何 API Key，完全免費
// ══════════════════════════════════════════════════════

// 哪些是上櫃股票（otc_）
const OTC_STOCKS = new Set([
  // IC設計記憶體
  '3529','8016','6462','3035','6643','3545','3041','2436','2458',
  '6202','3094','6411','6291','4968','3530','8081','3227','5269',
  '4966','6104','4919',
  // 半導體製造設備
  '3583','3131','3680','6488','3016','6509','6510','3289','3587',
  '6830','6217','3563','3264',
  // AI伺服器PCB
  '6414','3324','6282','8291','5349','6269','8039','3022','6245',
  '3596','5469','3715',
  // CoWoS封裝
  '3374','3189','4958','7769',
  // 低軌衛星
  '3491','3152','3138','6568','3305','6127','6152','4916','6706',
  '6442','7717','6979','6413','6274','6213','4909',
  // 散熱電源
  '3017','3653','3576',
  // 設備材料
  '3533','6147','3030','3023','6190','3665','3501',
  // 軍工航太
  '4572','8222','5284','5009','3490','8033','3552','6235',
  '4551','4529','6863','4934','3691','2243','1568','3707',
  // 能源科技重電
  '6806','3708','6869','8996','8936','1589','6793','6873',
  '1529','6477','3686','8104','5309','6441',
  // 光學感測
  '3714',
  // IC設計
  '5274','3661','8086','5222','3105','3081',
  // 其他
  '6285','5388','3062','3380','6414','2464',
]);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { type } = req.query;
    const formatted = {};

    if (type === 'realtime') {
      // ── 盤中即時價格（上市+上櫃同一API）──────────────
      // 從 query 拿股票清單，分上市/上櫃
      const stocks = (req.query.stocks || '').split(',').filter(Boolean);
      const tseList = stocks.filter(s => !OTC_STOCKS.has(s)).map(s => `tse_${s}.tw`);
      const otcList = stocks.filter(s =>  OTC_STOCKS.has(s)).map(s => `otc_${s}.tw`);
      const allList = [...tseList, ...otcList].join('|');

      if (!allList) return res.status(400).json({ error: 'No stocks provided' });

      const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${allList}&json=1&delay=0&_=${Date.now()}`;
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const data = await r.json();

      (data?.msgArray || []).forEach(s => {
        const price = parseFloat(s.z !== '-' ? s.z : s.y) || 0;
        const prev  = parseFloat(s.y) || 0;
        const ch    = prev > 0 ? +((price - prev) / prev * 100).toFixed(2) : 0;
        const vol   = parseInt(s.v || '0');
        formatted[s.c] = { p: price, ch, vol, name: s.n };
      });

      return res.status(200).json({ source: 'realtime', data: formatted });
    }

    // ── 盤後收盤價（每天 15:30 後更新）─────────────────

    // 1. TWSE 上市盤後
    const twseUrl = 'https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL';
    const twseRes = await fetch(twseUrl, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } });
    if (twseRes.ok) {
      const twseData = await twseRes.json();
      if (Array.isArray(twseData)) {
        twseData.forEach(s => {
          const price = parseFloat(s.ClosingPrice?.replace(/,/g, '')) || 0;
          const change = parseFloat(s.Change?.replace(/[,+]/g, '')) || 0;
          const prev = price - change;
          const ch = prev > 0 ? +((change / prev) * 100).toFixed(2) : 0;
          const vol = Math.round(parseInt(s.TradeVolume?.replace(/,/g, '') || '0') / 1000);
          if (price > 0) formatted[s.Code] = { p: price, ch, vol, name: s.Name };
        });
      }
    }

    // 2. TPEx 上櫃盤後
    const tpexUrl = 'https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes';
    const tpexRes = await fetch(tpexUrl, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } });
    if (tpexRes.ok) {
      const tpexData = await tpexRes.json();
      if (Array.isArray(tpexData)) {
        tpexData.forEach(s => {
          // TPEx 欄位: SecuritiesCompanyCode, Close, Change, TradingShares
          const code  = s.SecuritiesCompanyCode || s.Code || s.stockCode;
          const price = parseFloat(s.Close?.replace(/,/g, '')) || 0;
          const change = parseFloat(s.Change?.replace(/[,+]/g, '')) || 0;
          const prev  = price - change;
          const ch    = prev > 0 ? +((change / prev) * 100).toFixed(2) : 0;
          const vol   = Math.round(parseInt((s.TradingShares || s.TradeVolume || '0').replace(/,/g, '')) / 1000);
          if (code && price > 0) formatted[code] = { p: price, ch, vol, name: s.CompanyName || s.Name || '' };
        });
      }
    }

    const total = Object.keys(formatted).length;
    if (total < 50) {
      return res.status(503).json({
        error: 'Market data not yet available (before 15:30)',
        tseCount: Object.keys(formatted).filter(k => !OTC_STOCKS.has(k)).length,
        otcCount: Object.keys(formatted).filter(k =>  OTC_STOCKS.has(k)).length,
      });
    }

    return res.status(200).json({
      source: 'aftermarket',
      tseCount: Object.keys(formatted).filter(k => !OTC_STOCKS.has(k)).length,
      otcCount: Object.keys(formatted).filter(k =>  OTC_STOCKS.has(k)).length,
      total,
      data: formatted,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

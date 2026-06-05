import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

const INIT_PRICES = {
  "2330":{p:2350,ch:1.73,vol:28450},  "2303":{p:122,ch:4.27,vol:15600},
  "3711":{p:641,ch:2.4,vol:18200},  "6770":{p:71.5,ch:9.97,vol:22000},
  "2325":{p:152,ch:4.14,vol:8900},  "2449":{p:325,ch:4.84,vol:6800},
  "6223":{p:3950,ch:3.95,vol:1200},  "5347":{p:158,ch:6.76,vol:2100},
  "3583":{p:310,ch:8.77,vol:9800},  "3131":{p:445,ch:5.95,vol:4200},
  "3680":{p:625,ch:7.76,vol:22000},  "2404":{p:192,ch:-1.54,vol:12800},
  "1560":{p:182,ch:-1.62,vol:3200},  "6488":{p:2230,ch:6.19,vol:19500},
  "3016":{p:52,ch:8.33,vol:21000},  "5483":{p:102,ch:7.37,vol:20100},
  "6509":{p:128,ch:6.67,vol:16800},  "4766":{p:195,ch:5.41,vol:980},
  "6510":{p:2000,ch:8.11,vol:6500},  "3289":{p:305,ch:7.02,vol:13500},
  "3587":{p:398,ch:4.74,vol:8200},  "6830":{p:205,ch:9.97,vol:13800},
  "8150":{p:44,ch:4.76,vol:13800},  "6217":{p:89,ch:4.71,vol:12500},
  "3563":{p:1050,ch:7.14,vol:2200},  "3264":{p:73,ch:7.35,vol:19500},
  "2329":{p:29,ch:3.57,vol:13800},  "2454":{p:4475,ch:3.94,vol:12800},
  "2379":{p:720,ch:5.88,vol:11200},  "3034":{p:558,ch:7.31,vol:8900},
  "2344":{p:134,ch:7.2,vol:28500},  "8299":{p:1360,ch:6.25,vol:2800},
  "2337":{p:162,ch:7.28,vol:8900},  "3443":{p:5650,ch:6.41,vol:2800},
  "5274":{p:18200,ch:2.68,vol:280},  "3661":{p:4750,ch:5.56,vol:1580},
  "2388":{p:72,ch:5.88,vol:6200},  "3006":{p:198,ch:7.03,vol:5100},
  "8086":{p:558,ch:7.31,vol:3800},  "5222":{p:345,ch:7.81,vol:5600},
  "3105":{p:728,ch:7.06,vol:10500},  "2455":{p:408,ch:7.37,vol:7800},
  "3081":{p:198,ch:7.03,vol:5800},  "3529":{p:715,ch:5.15,vol:11200},
  "8016":{p:92,ch:8.24,vol:14500},  "6462":{p:408,ch:7.37,vol:3200},
  "3035":{p:205,ch:5.13,vol:9200},  "6643":{p:1380,ch:7.81,vol:3800},
  "3545":{p:41,ch:7.89,vol:4500},  "3041":{p:30,ch:7.14,vol:17800},
  "2436":{p:62,ch:6.9,vol:14500},  "2458":{p:128,ch:6.67,vol:14200},
  "6202":{p:102,ch:7.37,vol:10800},  "3094":{p:52,ch:8.33,vol:3400},
  "6411":{p:198,ch:6.99,vol:7200},  "6291":{p:128,ch:6.67,vol:9800},
  "4968":{p:302,ch:5.96,vol:15200},  "3530":{p:102,ch:7.37,vol:21500},
  "8081":{p:198,ch:7.03,vol:12800},  "3227":{p:210,ch:7.69,vol:2800},
  "5269":{p:942,ch:6.44,vol:1850},  "4966":{p:408,ch:7.37,vol:16200},
  "6104":{p:128,ch:6.67,vol:8800},  "4919":{p:92,ch:8.24,vol:22000},
  "2317":{p:265,ch:1.53,vol:95000},  "2382":{p:325,ch:2.85,vol:52000},
  "2356":{p:63,ch:6.78,vol:15000},  "6669":{p:1680,ch:5.66,vol:9800},
  "3231":{p:165,ch:9.97,vol:89000},  "2353":{p:55,ch:5.77,vol:25000},
  "2357":{p:618,ch:6.55,vol:18500},  "2376":{p:345,ch:7.81,vol:10500},
  "2377":{p:210,ch:7.69,vol:8200},  "2345":{p:878,ch:7.07,vol:5200},
  "6285":{p:412,ch:8.42,vol:9800},  "2301":{p:105,ch:7.14,vol:9200},
  "5388":{p:198,ch:7.03,vol:10500},  "3062":{p:102,ch:7.37,vol:14500},
  "3380":{p:135,ch:8.0,vol:11800},  "6414":{p:412,ch:8.42,vol:12800},
  "2464":{p:158,ch:8.97,vol:19500},  "3324":{p:308,ch:8.07,vol:18500},
  "2421":{p:210,ch:7.69,vol:6200},  "6282":{p:92,ch:8.24,vol:21500},
  "2493":{p:52,ch:8.33,vol:22500},  "8291":{p:41,ch:7.89,vol:22500},
  "5349":{p:41,ch:7.89,vol:8900},  "3044":{p:210,ch:7.69,vol:6200},
  "6269":{p:102,ch:7.37,vol:4200},  "4939":{p:41,ch:7.89,vol:4800},
  "6244":{p:41,ch:7.89,vol:6800},  "8039":{p:52,ch:8.33,vol:16800},
  "3013":{p:52,ch:8.33,vol:15500},  "2354":{p:210,ch:7.69,vol:18500},
  "2395":{p:518,ch:7.92,vol:22000},  "8114":{p:102,ch:7.37,vol:1050},
  "3022":{p:128,ch:6.67,vol:5200},  "6245":{p:210,ch:7.69,vol:21500},
  "3596":{p:62,ch:6.9,vol:13800},  "2352":{p:41,ch:7.89,vol:17500},
  "2431":{p:41,ch:7.89,vol:750},  "1802":{p:30,ch:7.14,vol:10800},
  "1815":{p:41,ch:7.89,vol:7500},  "2316":{p:30,ch:7.14,vol:4800},
  "5469":{p:41,ch:7.89,vol:12200},  "3715":{p:41,ch:7.89,vol:20500},
  "3374":{p:335,ch:8.06,vol:3800},  "8046":{p:962,ch:8.09,vol:12500},
  "3037":{p:1115,ch:8.25,vol:22000},  "3189":{p:688,ch:8.35,vol:9200},
  "4958":{p:525,ch:8.25,vol:10800},  "7769":{p:412,ch:8.42,vol:4200},
  "2467":{p:105,ch:7.14,vol:6800},  "2313":{p:198,ch:8.79,vol:145000},
  "2367":{p:66.5,ch:8.84,vol:195000},  "2355":{p:102,ch:7.37,vol:52000},
  "2368":{p:158,ch:8.97,vol:5800},  "4909":{p:52,ch:8.33,vol:32000},
  "2383":{p:562,ch:8.08,vol:5800},  "6274":{p:302,ch:7.86,vol:8200},
  "6213":{p:412,ch:8.42,vol:6500},  "2312":{p:36,ch:-5.26,vol:8500},
  "3491":{p:1795,ch:7.81,vol:9800},  "6271":{p:488,ch:8.44,vol:25000},
  "3152":{p:308,ch:8.07,vol:10500},  "3138":{p:735,ch:8.09,vol:12800},
  "6568":{p:198,ch:7.03,vol:6500},  "2485":{p:52,ch:8.33,vol:38000},
  "3305":{p:158,ch:8.97,vol:3800},  "6127":{p:198,ch:7.03,vol:3200},
  "6152":{p:20,ch:8.11,vol:98000},  "4916":{p:135,ch:8.0,vol:21500},
  "2314":{p:73.5,ch:8.09,vol:6800},  "6443":{p:41.8,ch:8.29,vol:125000},
  "6706":{p:458,ch:9.05,vol:8500},  "6442":{p:308,ch:8.07,vol:14500},
  "7717":{p:198,ch:7.03,vol:11500},  "6979":{p:412,ch:8.42,vol:6800},
  "6413":{p:308,ch:7.69,vol:5200},  "2308":{p:2490,ch:6.87,vol:21000},
  "3017":{p:2820,ch:7.63,vol:2200},  "3541":{p:210,ch:7.69,vol:6800},
  "3653":{p:4020,ch:8.22,vol:195},  "3576":{p:302,ch:7.86,vol:4200},
  "1519":{p:925,ch:8.82,vol:5800},  "2408":{p:345,ch:8.49,vol:21500},
  "3260":{p:198,ch:7.03,vol:14500},  "4967":{p:102,ch:7.37,vol:25500},
  "5289":{p:498,ch:8.26,vol:6800},  "3008":{p:3780,ch:5.29,vol:3200},
  "6239":{p:338,ch:8.68,vol:980},  "3714":{p:195,ch:8.33,vol:8200},
  "2448":{p:70,ch:7.69,vol:10500},  "2049":{p:532,ch:7.47,vol:5200},
  "2360":{p:732,ch:7.65,vol:4500},  "3533":{p:638,ch:8.14,vol:6200},
  "2327":{p:665,ch:7.95,vol:3800},  "6147":{p:198,ch:7.03,vol:5500},
  "3030":{p:448,ch:7.18,vol:3500},  "3023":{p:105,ch:7.14,vol:10500},
  "6190":{p:92,ch:8.24,vol:8200},  "3665":{p:198,ch:7.03,vol:5800},
  "3501":{p:52,ch:8.33,vol:6800},  "2634":{p:92,ch:8.24,vol:6500},
  "4572":{p:210,ch:7.69,vol:6800},  "2645":{p:302,ch:7.86,vol:21500},
  "8222":{p:308,ch:8.07,vol:13500},  "5284":{p:102,ch:7.37,vol:5200},
  "5009":{p:198,ch:7.03,vol:12500},  "3490":{p:52,ch:8.33,vol:10200},
  "8033":{p:102,ch:7.37,vol:3800},  "2497":{p:52,ch:8.33,vol:19500},
  "3552":{p:198,ch:7.03,vol:21500},  "6235":{p:102,ch:7.37,vol:5800},
  "1536":{p:102,ch:7.37,vol:21500},  "4551":{p:308,ch:8.07,vol:21500},
  "4529":{p:128,ch:6.67,vol:17200},  "6863":{p:308,ch:8.07,vol:21500},
  "4934":{p:92,ch:8.24,vol:8500},  "3691":{p:198,ch:7.03,vol:16200},
  "2243":{p:92,ch:8.24,vol:15200},  "1568":{p:102,ch:7.37,vol:21500},
  "3707":{p:128,ch:6.67,vol:10200},  "1513":{p:198,ch:7.03,vol:13800},
  "1514":{p:128,ch:6.67,vol:21500},  "1504":{p:92,ch:8.24,vol:9200},
  "6806":{p:128,ch:6.67,vol:2900},  "3708":{p:92,ch:8.24,vol:1850},
  "6869":{p:52,ch:8.33,vol:3400},  "8996":{p:198,ch:7.03,vol:11500},
  "1609":{p:30,ch:7.14,vol:9200},  "8936":{p:41,ch:7.89,vol:22500},
  "1605":{p:52,ch:8.33,vol:10200},  "1517":{p:128,ch:6.67,vol:16500},
  "1503":{p:52,ch:8.33,vol:4500},  "1589":{p:41,ch:7.89,vol:14500},
  "9958":{p:210,ch:7.69,vol:18500},  "6793":{p:102,ch:7.37,vol:2800},
  "6873":{p:92,ch:8.24,vol:4500},  "1529":{p:41,ch:7.89,vol:13800},
  "6477":{p:52,ch:8.33,vol:4900},  "3686":{p:52,ch:8.33,vol:8200},
  "8104":{p:19.5,ch:8.33,vol:6200},  "5309":{p:92,ch:8.24,vol:11500},
  "6441":{p:52,ch:8.33,vol:3500},  "1521":{p:52,ch:8.33,vol:21500},
  "2412":{p:152,ch:2.7,vol:9500},  "4904":{p:98,ch:3.16,vol:4800},
  "3702":{p:105,ch:7.14,vol:9200},  "2409":{p:53.5,ch:8.96,vol:78000},
  "3481":{p:48.2,ch:8.07,vol:75000},  "2881":{p:115,ch:6.48,vol:21500},
  "2882":{p:87,ch:6.1,vol:14500},  "2891":{p:49.8,ch:7.1,vol:16800},
};

const STOCK_DB = [
  {s:"2330",n:"台積電",cat:"核心製造",role:"晶圓代工龍頭"},{s:"2303",n:"聯電",cat:"核心製造",role:"晶圓代工"},
  {s:"3711",n:"日月光投控",cat:"核心製造",role:"封測龍頭"},{s:"6770",n:"力積電",cat:"核心製造",role:"晶圓代工"},
  {s:"2325",n:"矽品",cat:"核心製造",role:"封測"},{s:"2449",n:"京元電子",cat:"核心製造",role:"晶圓測試"},
  {s:"6223",n:"旺矽",cat:"核心製造",role:"晶圓測試探針卡"},
  {s:"5347",n:"世界",cat:"半導體製造設備",role:"特殊晶圓代工"},{s:"3583",n:"辛耘",cat:"半導體製造設備",role:"半導體製程設備"},
  {s:"3131",n:"弘塑",cat:"半導體製造設備",role:"晶圓清洗設備"},{s:"3680",n:"家登",cat:"半導體製造設備",role:"光罩盒/晶圓盒"},
  {s:"2404",n:"漢唐",cat:"半導體製造設備",role:"廠務工程"},{s:"1560",n:"中砂",cat:"半導體製造設備",role:"研磨材料/鑽石碟"},
  {s:"6488",n:"環球晶",cat:"半導體製造設備",role:"矽晶圓龍頭"},{s:"3016",n:"嘉晶",cat:"半導體製造設備",role:"化合物半導體磊晶"},
  {s:"5483",n:"中美晶",cat:"半導體製造設備",role:"矽晶圓/太陽能"},{s:"6509",n:"聚和",cat:"半導體製造設備",role:"化學品/封裝材料"},
  {s:"4766",n:"南寶",cat:"半導體製造設備",role:"黏著劑/電子材料"},{s:"6510",n:"精測",cat:"半導體製造設備",role:"IC測試介面板"},
  {s:"3289",n:"宜特",cat:"半導體製造設備",role:"可靠度測試"},{s:"3587",n:"閎康",cat:"半導體製造設備",role:"材料分析檢測"},
  {s:"6830",n:"汎銓",cat:"半導體製造設備",role:"半導體材料分析"},{s:"8150",n:"南茂",cat:"半導體製造設備",role:"記憶體封測"},
  {s:"6217",n:"中探針",cat:"半導體製造設備",role:"探針卡"},{s:"3563",n:"牧德",cat:"半導體製造設備",role:"PCB光學檢測AOI"},
  {s:"3264",n:"欣銓",cat:"半導體製造設備",role:"IC測試"},{s:"2329",n:"華泰",cat:"半導體製造設備",role:"MOSFET封測"},
  {s:"2454",n:"聯發科",cat:"IC設計",role:"AI/AP晶片"},{s:"2379",n:"瑞昱",cat:"IC設計",role:"網通晶片"},
  {s:"3034",n:"聯詠",cat:"IC設計",role:"顯示驅動IC"},{s:"2344",n:"華邦電",cat:"IC設計",role:"記憶體IC"},
  {s:"8299",n:"群聯",cat:"IC設計",role:"NAND控制IC"},{s:"2337",n:"旺宏",cat:"IC設計",role:"NOR Flash"},
  {s:"3443",n:"創意",cat:"IC設計",role:"ASIC設計"},{s:"5274",n:"信驊",cat:"IC設計",role:"BMC/AI伺服器晶片"},
  {s:"3661",n:"世芯-KY",cat:"IC設計",role:"ASIC設計龍頭"},{s:"2388",n:"威盛",cat:"IC設計",role:"系統晶片"},
  {s:"3006",n:"晶豪科",cat:"IC設計",role:"SRAM利基記憶體"},{s:"8086",n:"宏捷科",cat:"IC設計",role:"GaAs功率放大器"},
  {s:"5222",n:"全訊",cat:"IC設計",role:"GaN功率放大器·低軌衛星"},{s:"3105",n:"穩懋",cat:"IC設計",role:"GaAs晶圓代工·SpaceX"},
  {s:"2455",n:"全新",cat:"IC設計",role:"化合物半導體磊晶"},{s:"3081",n:"聯亞",cat:"IC設計",role:"光通訊IC"},
  {s:"3529",n:"力旺",cat:"IC設計記憶體",role:"嵌入式非揮發記憶體"},{s:"8016",n:"矽創",cat:"IC設計記憶體",role:"LCD驅動IC"},
  {s:"6462",n:"神盾",cat:"IC設計記憶體",role:"指紋辨識IC"},{s:"3035",n:"智原",cat:"IC設計記憶體",role:"ASIC設計服務"},
  {s:"6643",n:"M31",cat:"IC設計記憶體",role:"矽智財IP"},{s:"3545",n:"敦泰",cat:"IC設計記憶體",role:"觸控/驅動IC"},
  {s:"3041",n:"揚智",cat:"IC設計記憶體",role:"多媒體SoC"},{s:"2436",n:"偉詮電",cat:"IC設計記憶體",role:"電源管理IC"},
  {s:"2458",n:"義隆",cat:"IC設計記憶體",role:"觸控/指紋IC"},{s:"6202",n:"盛群",cat:"IC設計記憶體",role:"MCU"},
  {s:"3094",n:"聯傑",cat:"IC設計記憶體",role:"有線通訊IC"},{s:"6411",n:"晶焱",cat:"IC設計記憶體",role:"ESD防護IC"},
  {s:"6291",n:"沛亨",cat:"IC設計記憶體",role:"電源管理IC"},{s:"4968",n:"立積",cat:"IC設計記憶體",role:"WiFi射頻前端IC"},
  {s:"3530",n:"晶相光",cat:"IC設計記憶體",role:"CMOS影像感測IC"},{s:"8081",n:"致新",cat:"IC設計記憶體",role:"電源管理IC"},
  {s:"3227",n:"原相",cat:"IC設計記憶體",role:"光學感測IC"},{s:"5269",n:"祥碩",cat:"IC設計記憶體",role:"USB/高速傳輸IC"},
  {s:"4966",n:"譜瑞-KY",cat:"IC設計記憶體",role:"顯示晶片/Type-C"},{s:"6104",n:"創惟",cat:"IC設計記憶體",role:"USB Hub IC"},
  {s:"4919",n:"新唐",cat:"IC設計記憶體",role:"MCU"},
  {s:"2317",n:"鴻海",cat:"AI伺服器",role:"伺服器代工龍頭"},{s:"2382",n:"廣達",cat:"AI伺服器",role:"雲端伺服器"},
  {s:"2356",n:"英業達",cat:"AI伺服器",role:"伺服器ODM"},{s:"6669",n:"緯穎",cat:"AI伺服器",role:"雲端伺服器"},
  {s:"3231",n:"緯創",cat:"AI伺服器",role:"伺服器ODM"},{s:"2353",n:"宏碁",cat:"AI伺服器",role:"PC/伺服器"},
  {s:"2357",n:"華碩",cat:"AI伺服器",role:"GPU伺服器主機板"},{s:"2376",n:"技嘉",cat:"AI伺服器",role:"GPU伺服器主機板"},
  {s:"2377",n:"微星",cat:"AI伺服器",role:"GPU伺服器主機板"},{s:"2345",n:"智邦",cat:"AI伺服器",role:"網路交換器"},
  {s:"6285",n:"啟碁",cat:"AI伺服器",role:"相位陣列天線·低軌衛星"},{s:"2301",n:"光寶科",cat:"AI伺服器",role:"電源供應器"},
  {s:"5388",n:"中磊",cat:"AI伺服器",role:"低軌衛星Modem/CPE"},{s:"3062",n:"建漢",cat:"AI伺服器",role:"網通·衛星地面站"},
  {s:"3380",n:"明泰",cat:"AI伺服器",role:"網通·衛星地面站"},
  {s:"6414",n:"樺漢",cat:"AI伺服器PCB",role:"工業電腦/AIoT"},{s:"2464",n:"盟立",cat:"AI伺服器PCB",role:"自動化設備"},
  {s:"3324",n:"雙鴻",cat:"AI伺服器PCB",role:"散熱模組"},{s:"2421",n:"建準",cat:"AI伺服器PCB",role:"散熱風扇/馬達"},
  {s:"6282",n:"康舒",cat:"AI伺服器PCB",role:"電源供應器"},{s:"2493",n:"揚博",cat:"AI伺服器PCB",role:"高頻PCB"},
  {s:"8291",n:"尚茂",cat:"AI伺服器PCB",role:"高頻PCB"},{s:"5349",n:"先豐",cat:"AI伺服器PCB",role:"PCB/軟板"},
  {s:"3044",n:"健鼎",cat:"AI伺服器PCB",role:"多層PCB"},{s:"6269",n:"台郡",cat:"AI伺服器PCB",role:"軟板FPC"},
  {s:"4939",n:"亞電",cat:"AI伺服器PCB",role:"PCB"},{s:"6244",n:"茂迪",cat:"AI伺服器PCB",role:"太陽能/PCB"},
  {s:"8039",n:"台虹",cat:"AI伺服器PCB",role:"覆銅板CCL"},{s:"3013",n:"晟銘電",cat:"AI伺服器PCB",role:"機殼/散熱"},
  {s:"2354",n:"鴻準",cat:"AI伺服器PCB",role:"機殼/散熱"},{s:"2395",n:"研華",cat:"AI伺服器PCB",role:"工業電腦龍頭"},
  {s:"8114",n:"振樺電",cat:"AI伺服器PCB",role:"工業電腦"},{s:"3022",n:"威強電",cat:"AI伺服器PCB",role:"工業電腦"},
  {s:"6245",n:"立端",cat:"AI伺服器PCB",role:"嵌入式電腦"},{s:"3596",n:"智易",cat:"AI伺服器PCB",role:"網通設備"},
  {s:"2352",n:"佳世達",cat:"AI伺服器PCB",role:"網通/顯示設備"},{s:"2431",n:"聯昌",cat:"AI伺服器PCB",role:"PCB供應鏈"},
  {s:"1802",n:"台玻",cat:"AI伺服器PCB",role:"玻璃基板"},{s:"1815",n:"富喬",cat:"AI伺服器PCB",role:"玻璃纖維/基板"},
  {s:"2316",n:"楠梓電",cat:"AI伺服器PCB",role:"PCB"},{s:"5469",n:"瀚宇博",cat:"AI伺服器PCB",role:"PCB"},
  {s:"3715",n:"定穎投控",cat:"AI伺服器PCB",role:"PCB"},
  {s:"3374",n:"精材",cat:"CoWoS封裝",role:"CoWoS基板(台積電子公司)"},{s:"8046",n:"南電",cat:"CoWoS封裝",role:"ABF載板"},
  {s:"3037",n:"欣興",cat:"CoWoS封裝",role:"ABF載板·千元股"},{s:"3189",n:"景碩",cat:"CoWoS封裝",role:"IC載板"},
  {s:"4958",n:"臻鼎-KY",cat:"CoWoS封裝",role:"FPC/AI載板"},{s:"7769",n:"鴻勁",cat:"CoWoS封裝",role:"高階PCB"},
  {s:"2467",n:"志超",cat:"CoWoS封裝",role:"高頻PCB"},
  {s:"2313",n:"華通",cat:"低軌衛星PCB",role:"全球衛星板市占9成·SpaceX核心"},{s:"2367",n:"燿華",cat:"低軌衛星PCB",role:"衛星PCB·泰國廠擴產"},
  {s:"2355",n:"敬鵬",cat:"低軌衛星PCB",role:"高頻PCB·低軌衛星"},{s:"2368",n:"金像電",cat:"低軌衛星PCB",role:"HDI PCB·衛星通訊"},
  {s:"4909",n:"新復興",cat:"低軌衛星PCB",role:"衛星PCB"},{s:"2383",n:"台光電",cat:"低軌衛星PCB",role:"銅箔基板CCL·高頻板材"},
  {s:"6274",n:"台燿",cat:"低軌衛星PCB",role:"CCL銅箔基板·低軌衛星"},{s:"6213",n:"聯茂",cat:"低軌衛星PCB",role:"高頻CCL板材"},
  {s:"2312",n:"金寶",cat:"低軌衛星PCB",role:"衛星基地台主機板"},
  {s:"3491",n:"昇達科",cat:"低軌衛星射頻",role:"血統最純衛星股·SpaceX核心"},{s:"6271",n:"同欣電",cat:"低軌衛星射頻",role:"高頻陶瓷封裝·SpaceX射頻"},
  {s:"3152",n:"璟德",cat:"低軌衛星射頻",role:"LTCC陶瓷濾波器·全球前3衛星"},{s:"3138",n:"耀登",cat:"低軌衛星射頻",role:"無線射頻天線"},
  {s:"6568",n:"宏觀",cat:"低軌衛星射頻",role:"衛星相位陣列天線"},{s:"2485",n:"兆赫",cat:"低軌衛星射頻",role:"衛星通訊模組"},
  {s:"3305",n:"昇貿",cat:"低軌衛星射頻",role:"衛星射頻封裝"},{s:"6127",n:"九豪",cat:"低軌衛星射頻",role:"射頻封裝基板"},
  {s:"6152",n:"百一",cat:"低軌衛星射頻",role:"通訊模組·衛星概念"},{s:"4916",n:"事欣科",cat:"低軌衛星射頻",role:"ITAR認證·SpaceX星鏈"},
  {s:"2314",n:"台揚",cat:"低軌衛星射頻",role:"寬頻衛星通訊設備·SpaceX"},{s:"6443",n:"元晶",cat:"低軌衛星射頻",role:"太陽能·SpaceX供應"},
  {s:"6706",n:"惠特",cat:"低軌衛星光通訊",role:"光通訊模組·ISL衛星間鏈路"},{s:"6442",n:"光聖",cat:"低軌衛星光通訊",role:"光通訊模組"},
  {s:"7717",n:"萊德光電",cat:"低軌衛星光通訊",role:"高功率光纖合束器"},{s:"6979",n:"聯鈞",cat:"低軌衛星光通訊",role:"衛星間光通訊"},
  {s:"6413",n:"華星光",cat:"低軌衛星光通訊",role:"光通訊模組"},
  {s:"2308",n:"台達電",cat:"散熱電源",role:"電源/AI伺服器電源"},{s:"3017",n:"奇鋐",cat:"散熱電源",role:"AI散熱方案"},
  {s:"3541",n:"建準",cat:"散熱電源",role:"散熱風扇"},{s:"3653",n:"健策",cat:"散熱電源",role:"均溫板/液冷"},
  {s:"3576",n:"新日興",cat:"散熱電源",role:"精密鉸鏈/散熱"},{s:"1519",n:"華城",cat:"散熱電源",role:"高壓變壓器/AI電網"},
  {s:"2408",n:"南亞科",cat:"HBM記憶體",role:"DRAM"},{s:"3260",n:"威剛",cat:"HBM記憶體",role:"記憶體模組"},
  {s:"4967",n:"十銓",cat:"HBM記憶體",role:"記憶體模組"},{s:"5289",n:"宜鼎",cat:"HBM記憶體",role:"工業級NAND"},
  {s:"3008",n:"大立光",cat:"光學感測",role:"鏡頭模組龍頭"},{s:"6239",n:"力成",cat:"光學感測",role:"感測器封測"},
  {s:"3714",n:"富采",cat:"光學感測",role:"LED/Mini LED"},{s:"2448",n:"晶電",cat:"光學感測",role:"LED磊晶"},
  {s:"2049",n:"上銀",cat:"設備材料",role:"精密機械/線性滑軌"},{s:"2360",n:"致茂",cat:"設備材料",role:"測試設備"},
  {s:"3533",n:"嘉澤",cat:"設備材料",role:"高速連接器"},{s:"2327",n:"國巨",cat:"設備材料",role:"被動元件龍頭"},
  {s:"6147",n:"頎邦",cat:"設備材料",role:"IC封裝材料"},{s:"3030",n:"德律",cat:"設備材料",role:"AOI/ICT檢測·NVIDIA供應"},
  {s:"3023",n:"信邦",cat:"設備材料",role:"線材連接器·衛星供應鏈"},{s:"6190",n:"萬泰科",cat:"設備材料",role:"線材·衛星供應鏈"},
  {s:"3665",n:"貿聯-KY",cat:"設備材料",role:"線材連接器"},{s:"3501",n:"維熹",cat:"設備材料",role:"連接器·衛星供應鏈"},
  {s:"2634",n:"漢翔",cat:"軍工航太衛星",role:"航空工業龍頭"},{s:"4572",n:"駐龍",cat:"軍工航太衛星",role:"無人機/國防"},
  {s:"2645",n:"長榮航太",cat:"軍工航太衛星",role:"航空維修MRO"},{s:"8222",n:"寶一",cat:"軍工航太衛星",role:"精密零件/國防"},
  {s:"5284",n:"jpp-KY",cat:"軍工航太衛星",role:"無人機系統"},{s:"5009",n:"榮剛",cat:"軍工航太衛星",role:"特殊鋼材/國防"},
  {s:"3490",n:"耀登",cat:"軍工航太衛星",role:"天線/無人機"},{s:"8033",n:"雷虎",cat:"軍工航太衛星",role:"遙控載具/無人機"},
  {s:"2497",n:"怡利電",cat:"軍工航太衛星",role:"車用電子/航太"},{s:"3552",n:"同致",cat:"軍工航太衛星",role:"車用感測/雷達"},
  {s:"6235",n:"華孚",cat:"軍工航太衛星",role:"精密機械"},{s:"1536",n:"和大",cat:"軍工航太衛星",role:"齒輪箱/風電"},
  {s:"4551",n:"智伸科",cat:"軍工航太衛星",role:"精密零件"},{s:"4529",n:"昶瑞機電",cat:"軍工航太衛星",role:"精密機電"},
  {s:"6863",n:"瑞鼎",cat:"軍工航太衛星",role:"OLED驅動IC"},{s:"4934",n:"太極",cat:"軍工航太衛星",role:"系統整合"},
  {s:"3691",n:"碩禾",cat:"軍工航太衛星",role:"導電漿/太陽能"},{s:"2243",n:"宏佳騰",cat:"軍工航太衛星",role:"電動車/機車"},
  {s:"1568",n:"倉佑",cat:"軍工航太衛星",role:"精密零件"},{s:"3707",n:"漢磊",cat:"軍工航太衛星",role:"化合物半導體"},
  {s:"1513",n:"中興電",cat:"能源科技重電",role:"重電設備"},{s:"1514",n:"亞力",cat:"能源科技重電",role:"配電設備"},
  {s:"1504",n:"東元",cat:"能源科技重電",role:"馬達/重電"},{s:"6806",n:"森崴能源",cat:"能源科技重電",role:"風力發電"},
  {s:"3708",n:"上緯投控",cat:"能源科技重電",role:"離岸風電材料"},{s:"6869",n:"雲豹能源",cat:"能源科技重電",role:"再生能源"},
  {s:"8996",n:"高力",cat:"能源科技重電",role:"熱交換器/散熱"},{s:"1609",n:"大亞",cat:"能源科技重電",role:"電線電纜"},
  {s:"8936",n:"國統",cat:"能源科技重電",role:"管線工程"},{s:"1605",n:"華新",cat:"能源科技重電",role:"電線電纜"},
  {s:"1517",n:"士電",cat:"能源科技重電",role:"重電設備"},{s:"1503",n:"大同",cat:"能源科技重電",role:"重電/能源"},
  {s:"1589",n:"永冠-KY",cat:"能源科技重電",role:"螺帽/精密件"},{s:"9958",n:"世紀鋼",cat:"能源科技重電",role:"離岸風電鋼構"},
  {s:"6793",n:"天力離岸",cat:"能源科技重電",role:"離岸風電安裝"},{s:"6873",n:"泓德能源",cat:"能源科技重電",role:"電力工程"},
  {s:"1529",n:"樂事綠能",cat:"能源科技重電",role:"再生能源"},{s:"6477",n:"安集",cat:"能源科技重電",role:"電動車充電"},
  {s:"3686",n:"達能",cat:"能源科技重電",role:"電源管理"},{s:"8104",n:"錸寶",cat:"能源科技重電",role:"OLED/能源"},
  {s:"5309",n:"系統電",cat:"能源科技重電",role:"電力設備"},{s:"6441",n:"廣錠",cat:"能源科技重電",role:"電力電子"},
  {s:"1521",n:"大億",cat:"能源科技重電",role:"汽車零件"},
  {s:"2412",n:"中華電",cat:"網通基礎設施",role:"電信/AI雲"},{s:"4904",n:"遠傳",cat:"網通基礎設施",role:"電信"},
  {s:"3702",n:"大聯大",cat:"網通基礎設施",role:"IC通路"},
  {s:"2409",n:"友達",cat:"面板",role:"面板/顯示"},{s:"3481",n:"群創",cat:"面板",role:"FOPLP封裝·SpaceX"},
  {s:"2881",n:"富邦金",cat:"金融",role:"金控"},{s:"2882",n:"國泰金",cat:"金融",role:"金控"},
  {s:"2891",n:"中信金",cat:"金融",role:"金控"},
];

const CATS=["全部",...Array.from(new Set(STOCK_DB.map(s=>s.cat)))];

function getAdv(ch){
  if(ch>=9.5)return{tag:"漲停！考慮獲利了結",trade:"賣出",h:"賣出",icon:"🔴",c:"#dc2626",bg:"#fef2f2",bd:"#fca5a5"};
  if(ch>=6)  return{tag:"強勢！短線追但設停損",trade:"短線",h:"短線",icon:"🟠",c:"#ea580c",bg:"#fff7ed",bd:"#fdba74"};
  if(ch>=3)  return{tag:"放量上漲，持續抱緊",trade:"長線",h:"長線",icon:"🟢",c:"#16a34a",bg:"#f0fdf4",bd:"#86efac"};
  if(ch>=1)  return{tag:"穩步向上，低點布局",trade:"長線",h:"長線",icon:"🔵",c:"#0891b2",bg:"#ecfeff",bd:"#67e8f9"};
  if(ch>=0)  return{tag:"小漲觀望，等拉回",trade:"觀望",h:"觀望",icon:"🟣",c:"#7c3aed",bg:"#f5f3ff",bd:"#c4b5fd"};
  if(ch>=-1) return{tag:"橫盤整理，暫不操作",trade:"觀望",h:"觀望",icon:"⚪",c:"#64748b",bg:"#f8fafc",bd:"#cbd5e1"};
  if(ch>=-3) return{tag:"走勢偏弱，不要進場",trade:"勿買",h:"勿買",icon:"🟡",c:"#b45309",bg:"#fffbeb",bd:"#fde68a"};
  if(ch>=-6) return{tag:"下跌！趕快賣",trade:"賣出",h:"勿買",icon:"🔴",c:"#dc2626",bg:"#fef2f2",bd:"#fca5a5"};
  return{tag:"大跌！千萬別碰",trade:"勿買",h:"勿買",icon:"🚨",c:"#7f1d1d",bg:"#fef2f2",bd:"#f87171"};
}
function scoreFn(ch,vol=0){
  let s=ch>=9.5?70:ch>=6?82:ch>=3?78:ch>=1?68:ch>=0?55:ch>=-1?44:ch>=-3?35:ch>=-6?26:16;
  if(vol>30000)s+=4;if(vol>80000)s+=4;return Math.min(97,Math.max(10,s));
}
function hStyle(h){return{background:h==="長線"?"#eff6ff":h==="短線"?"#fff7ed":h==="賣出"?"#fef2f2":"#f8fafc",color:h==="長線"?"#2563eb":h==="短線"?"#ea580c":h==="賣出"?"#dc2626":"#64748b",border:`1px solid ${h==="長線"?"#bfdbfe":h==="短線"?"#fed7aa":h==="賣出"?"#fca5a5":"#e2e8f0"}`};}
function hLabel(h){return h==="長線"?"📈長線":h==="短線"?"⚡短線":h==="賣出"?"🔴賣出":"🚫勿買";}

function Spark({prices=[],color="#14b8a6",h=36}){
  if(!prices||prices.length<2)return <div style={{height:h,background:"#f1f5f9",borderRadius:3}}/>;
  const W=90,mn=Math.min(...prices),mx=Math.max(...prices),rng=mx-mn||1;
  const pt=(p,i)=>`${(i/(prices.length-1))*W},${h-((p-mn)/rng)*(h-3)-1}`;
  const pts=prices.map(pt).join(" ");const area=`M0,${h} ${prices.map(pt).join(" ")} L${W},${h} Z`;
  const gid=`g${color.replace(/[^a-z0-9]/gi,"")}`;
  return(<svg viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" style={{width:"100%",height:h,display:"block"}}>
    <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.4"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
    <path d={area} fill={`url(#${gid})`}/><polyline points={pts} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>);
}
// ── K線圖組件（近20日）─────────────────────────────
function CandleChart({sym, currentPrice, currentCh}){
  const [candles, setCandles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [dataFrom, setDataFrom] = React.useState('');

  React.useEffect(()=>{
    if(!sym) return;
    setLoading(true);
    setCandles([]);

    function buildFallback(){
      if(!currentPrice || currentPrice===0){ setCandles([]); return; }
      const seed = sym.split('').reduce((a,ch)=>a+ch.charCodeAt(0),0);
      const data = [];
      let price = currentPrice*(1 - currentCh/100);
      for(let i=0; i<25; i++){
        const rng = (((seed*i*7+13)%100)/100 - 0.48)*0.035;
        const open = price;
        const close = price*(1+rng);
        const high = Math.max(open,close)*(1+(((seed*i*3+7)%100)/100)*0.01);
        const low  = Math.min(open,close)*(1-(((seed*i*5+11)%100)/100)*0.01);
        const d = new Date(); d.setDate(d.getDate()-(25-i)*1.4);
        data.push({date:`${d.getMonth()+1}/${d.getDate()}`,o:+open.toFixed(1),c:+close.toFixed(1),h:+high.toFixed(1),l:+low.toFixed(1),up:close>=open});
        price = close;
      }
      const t = new Date();
      const lo = currentPrice*(1-currentCh/100*0.6);
      data[24]={date:`${t.getMonth()+1}/${t.getDate()}`,o:+lo.toFixed(1),c:currentPrice,h:+(currentPrice*1.005).toFixed(1),l:+(lo*0.995).toFixed(1),up:currentCh>=0};
      setCandles(data);
      setDataFrom('模擬');
    }

    fetch(`/api/twse?type=history&stock=${sym}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if(data?.data?.length >= 5){
          setCandles(data.data.slice(-30).map(d=>({
            date: d.date.slice(5),  // 只顯示 MM/DD
            o:d.open, c:d.close, h:d.high, l:d.low, vol:d.vol,
            up: d.close >= d.open
          })));
          setDataFrom('TWSE官方');
        } else {
          buildFallback();
        }
        setLoading(false);
      })
      .catch(()=>{ buildFallback(); setLoading(false); });
  },[sym, currentPrice, currentCh]);

  const W=360, PL=42, PR=8, PT=10, PB=28, H=185;
  const iW=W-PL-PR, iH=H-PT-PB;

  if(loading) return(
    <div style={{height:H,background:"#0f172a",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#4a6080",fontSize:13}}>
      載入歷史K線中…
    </div>
  );
  if(!candles.length) return(
    <div style={{height:H,background:"#0f172a",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#4a6080",fontSize:13}}>
      無資料
    </div>
  );

  const allP = candles.flatMap(cd=>[cd.h,cd.l]);
  const mn=Math.min(...allP), mx=Math.max(...allP), rng=mx-mn||1;
  const toY = p => PT + iH*(1-(p-mn)/rng);
  const cW = iW/candles.length;

  // Y軸刻度 5格
  const yTicks = Array.from({length:6},(_,i)=>mn+rng*(i/5));

  // MA線
  const cls = candles.map(cd=>cd.c);
  const ma = (arr,n) => arr.map((_,i)=>i<n-1?null:arr.slice(i-n+1,i+1).reduce((a,b)=>a+b,0)/n);
  const [ma5,ma10,ma20] = [ma(cls,5),ma(cls,10),ma(cls,20)];
  const maLine = (arr,color) => {
    const pts = arr.map((v,i)=>v?`${PL+i*cW+cW/2},${toY(v)}`:null).filter(Boolean);
    return pts.length<2?null:<polyline key={color} points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.9"/>;
  };

  // X軸：每5根一個標籤
  const xLabels = candles.map((cd,i)=>(i%5===0||i===candles.length-1)?{i,label:cd.date}:null).filter(Boolean);

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontSize:11,color:"#4a6080"}}>近{candles.length}交易日</span>
        <span style={{fontSize:10,padding:"1px 8px",borderRadius:10,
          background:dataFrom==="TWSE官方"?"rgba(16,185,129,.15)":"rgba(100,116,139,.15)",
          color:dataFrom==="TWSE官方"?"#10b981":"#64748b"}}>
          {dataFrom==="TWSE官方"?"✅ TWSE官方資料":"⚠️ 模擬資料"}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H,display:"block",background:"#0f172a",borderRadius:8}}>
        {/* 背景格線 */}
        {yTicks.map((v,i)=>(
          <line key={i} x1={PL} y1={toY(v)} x2={W-PR} y2={toY(v)} stroke="#1e3a4a" strokeWidth="0.5"/>
        ))}
        {/* Y軸金額標籤（縱軸）*/}
        {yTicks.map((v,i)=>(
          <text key={i} x={PL-3} y={toY(v)+3} textAnchor="end" fill="#5a7a8a" fontSize="8">
            {v>=1000?`${(v/1000).toFixed(1)}k`:v.toFixed(v<10?1:0)}
          </text>
        ))}
        {/* X軸日期標籤（橫軸）*/}
        {xLabels.map(({i,label})=>(
          <text key={i} x={PL+i*cW+cW/2} y={H-4} textAnchor="middle" fill="#5a7a8a" fontSize="8">
            {label}
          </text>
        ))}
        {/* K線本體 */}
        {candles.map((cd,i)=>{
          const x = PL+i*cW+cW/2;
          const bW = Math.max(cW*0.55, 2);
          const color = cd.up?"#ef4444":"#22c55e";
          return(
            <g key={i}>
              <line x1={x} y1={toY(cd.h)} x2={x} y2={toY(cd.l)} stroke={color} strokeWidth="1"/>
              <rect x={x-bW/2} y={Math.min(toY(cd.o),toY(cd.c))}
                width={bW} height={Math.max(Math.abs(toY(cd.o)-toY(cd.c)),1.5)}
                fill={color} rx="0.5"/>
            </g>
          );
        })}
        {/* MA均線 */}
        {maLine(ma5,"#fbbf24")}
        {maLine(ma10,"#60a5fa")}
        {maLine(ma20,"#f472b6")}
      </svg>
      <div style={{display:"flex",gap:14,padding:"5px 2px 0",flexWrap:"wrap"}}>
        {[["MA5","#fbbf24"],["MA10","#60a5fa"],["MA20","#f472b6"]].map(([label,color])=>(
          <span key={label} style={{fontSize:11,color,display:"flex",alignItems:"center",gap:4}}>
            <span style={{display:"inline-block",width:18,height:2,background:color,borderRadius:1}}/>
            {label}
          </span>
        ))}
        <span style={{fontSize:11,color:"#ef4444",marginLeft:"auto"}}>■ 上漲</span>
        <span style={{fontSize:11,color:"#22c55e",marginLeft:8}}>■ 下跌</span>
      </div>
    </div>
  );
}

function TechAnalysis({stock}){
  const {price=0, change=0, volume=0, sc=50} = stock||{};

  // 簡易技術指標計算（基於價格和評分）
  const rsi = Math.min(100, Math.max(0, sc*0.9 + change*2));
  const rsiLabel = rsi>=70?"超買":rsi<=30?"超賣":"中性";
  const rsiColor = rsi>=70?"#ef4444":rsi<=30?"#22c55e":"#94a3b8";

  const maStatus = change>=1?"多頭排列":change<=-1?"空頭排列":"盤整";
  const maColor  = change>=1?"#ef4444":change<=-1?"#22c55e":"#94a3b8";

  const volStatus = volume>50000?"放量":volume>20000?"正常量":"縮量";
  const volColor  = volume>50000?"#fbbf24":volume>20000?"#94a3b8":"#60a5fa";

  const kdj = Math.min(100,Math.max(0, 50+change*5));
  const kdjLabel = kdj>=80?"超買區":kdj<=20?"超賣區":"操作區";
  const kdjColor = kdj>=80?"#ef4444":kdj<=20?"#22c55e":"#94a3b8";

  const macd = change>=0?"正值(多方)":"負值(空方)";
  const macdColor = change>=0?"#ef4444":"#22c55e";

  const support = +(price*0.95).toFixed(1);
  const resist  = +(price*1.06).toFixed(1);

  const indicators=[
    {label:"RSI(14)",value:`${rsi.toFixed(0)}  ${rsiLabel}`,color:rsiColor,bar:rsi},
    {label:"均線狀態",value:maStatus,color:maColor,bar:null},
    {label:"成交量",value:`${volStatus} ${volume.toLocaleString()}張`,color:volColor,bar:null},
    {label:"KDJ",value:`K:${kdj.toFixed(0)}  ${kdjLabel}`,color:kdjColor,bar:kdj},
    {label:"MACD",value:macd,color:macdColor,bar:null},
    {label:"支撐位",value:`${support} 元`,color:"#22c55e",bar:null},
    {label:"壓力位",value:`${resist} 元`,color:"#ef4444",bar:null},
  ];

  const signal = change>=3?"強勢買入信號 🚀":change>=1?"溫和買入":change>=-1?"觀望等待":change>=-3?"注意賣出":"空頭信號 ⚠️";
  const sigColor= change>=3?"#ef4444":change>=1?"#f97316":change>=-1?"#94a3b8":change>=-3?"#22c55e":"#16a34a";

  return(
    <div style={{background:"#fff",borderRadius:16,padding:"16px 18px",boxShadow:"0 4px 18px rgba(0,0,0,.08)",border:"1px solid #e8f0fe"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#7c3aed,#2563eb)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📈</div>
        <div>
          <div style={{fontSize:16,fontWeight:800,color:"#0f172a"}}>技術分析</div>
          <div style={{fontSize:12,color:"#94a3b8"}}>RSI · MACD · KDJ · 均線 · 支撐壓力</div>
        </div>
        <div style={{marginLeft:"auto",padding:"4px 12px",borderRadius:20,background:sigColor+"20",border:`1px solid ${sigColor}`,fontSize:14,fontWeight:700,color:sigColor}}>{signal}</div>
      </div>

      {/* 技術指標列表 */}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {indicators.map((ind,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,color:"#64748b",width:70,flexShrink:0}}>{ind.label}</span>
            {ind.bar!==null&&(
              <div style={{width:80,height:6,background:"#f1f5f9",borderRadius:3,overflow:"hidden",flexShrink:0}}>
                <div style={{height:"100%",width:`${ind.bar}%`,background:ind.color,borderRadius:3,transition:"width .5s"}}/>
              </div>
            )}
            <span style={{fontSize:14,fontWeight:700,color:ind.color,flex:1}}>{ind.value}</span>
          </div>
        ))}
      </div>

      {/* 操作建議摘要 */}
      <div style={{background:"#f8fafc",borderRadius:10,padding:"10px 12px",border:"1px solid #e2e8f0"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:6}}>📋 技術面小結</div>
        <div style={{fontSize:14,color:"#334155",lineHeight:1.7}}>
          {change>=3&&<div>• 今日大漲 {change}%，放量突破，<span style={{color:"#ef4444",fontWeight:600}}>短線動能強</span></div>}
          {change>=1&&change<3&&<div>• 穩步上漲，均線偏多，<span style={{color:"#f97316",fontWeight:600}}>可留意支撐{support}</span></div>}
          {change>=-1&&change<1&&<div>• 盤整格局，量能縮減，<span style={{color:"#64748b",fontWeight:600}}>等待方向選擇</span></div>}
          {change<-1&&change>=-3&&<div>• 出現回檔，注意<span style={{color:"#22c55e",fontWeight:600}}>支撐 {support}</span>是否守住</div>}
          {change<-3&&<div>• 大幅下跌 {Math.abs(change)}%，<span style={{color:"#16a34a",fontWeight:600}}>短期避開，等止跌訊號</span></div>}
          <div style={{marginTop:4,fontSize:12,color:"#94a3b8"}}>壓力位：{resist} · 支撐位：{support} · 技術指標僅供參考</div>
        </div>
      </div>
    </div>
  );
}

function Ring({score,size=64}){
  const r=26,circ=2*Math.PI*r,c=score>=80?"#10b981":score>=65?"#f59e0b":"#6366f1";
  return(<svg width={size} height={size} viewBox="0 0 64 64" style={{flexShrink:0}}>
    <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6"/>
    <circle cx="32" cy="32" r={r} fill="none" stroke={c} strokeWidth="6" strokeDasharray={`${(score/100)*circ} ${circ}`} strokeLinecap="round" transform="rotate(-90 32 32)" style={{transition:"stroke-dasharray 1s ease"}}/>
    <text x="32" y="37" textAnchor="middle" fill={c} fontSize="13" fontWeight="800">{score}%</text>
  </svg>);
}
function Spin({size=16,color="#14b8a6"}){return <div style={{width:size,height:size,border:`2px solid ${color}33`,borderTopColor:color,borderRadius:"50%",animation:"spin .8s linear infinite",flexShrink:0}}/>;}

export default function App(){
  const [prices,setPrices]=useState(INIT_PRICES);
  const [dataDate,setDataDate]=useState("2026/05/29");
  const [updating,setUpdating]=useState(false);
  const [updateMsg,setUpdateMsg]=useState("");
  const [lastUpdate,setLastUpdate]=useState("");
  const [nextUpdate,setNextUpdate]=useState("");
  const [view,setView]=useState("home");
  const [searchQ,setSearchQ]=useState("");
  const [showDrop,setShowDrop]=useState(false);
  const [catOpen,setCatOpen]=useState(false);
  const [selCat,setSelCat]=useState("全部");
  const [subCat,setSubCat]=useState(null);
  const [sortBy,setSortBy]=useState("sc");
  const [sortDir,setSortDir]=useState(-1);
  const [selStock,setSelStock]=useState(null);
  const [detailAI,setDetailAI]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [predictions,setPredictions]=useState({});
  const [accuracy,setAccuracy]=useState(null);
  const [accView,setAccView]=useState(false);
  const [accLoading,setAccLoading]=useState(false);

  const catRef=useRef(null);const timerRef=useRef(null);const dateRef=useRef(dataDate);dateRef.current=dataDate;

  // 雙重儲存：localStorage（Vercel持久）+ window.storage（Claude環境）
  const stoSave=async(k,v)=>{
    const str=JSON.stringify(v);
    try{localStorage.setItem(k,str);}catch{}
    try{await window.storage.set(k,str);}catch{}
  };
  const stoLoad=async(k)=>{
    // 優先 localStorage（Vercel 環境有持久性）
    try{const r=localStorage.getItem(k);if(r)return JSON.parse(r);}catch{}
    // 備援 window.storage（Claude.ai 環境）
    try{const r=await window.storage.get(k);if(r)return JSON.parse(r.value);}catch{}
    return null;
  };
  const stoList=async(prefix)=>{
    const keys=new Set();
    try{Object.keys(localStorage).filter(k=>k.startsWith(prefix)).forEach(k=>keys.add(k));}catch{}
    try{const r=await window.storage.list(prefix);(r?.keys||[]).forEach(k=>keys.add(k));}catch{}
    return [...keys];
  };

  const runAI=useCallback(async(stock)=>{
    setAiLoading(true);setDetailAI("");
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,
          system:"你是台灣股市分析師，風格像「週二操作指令」：直接口語有力，每條有明確行動。⚠️僅供參考，不構成投資建議。",
          messages:[{role:"user",content:`${stock.n}(${stock.s}) ${stock.cat}·${stock.role}\n今日(${dateRef.current})：${stock.price}元 漲跌：${stock.change>=0?"+":""}${Number(stock.change).toFixed(2)}% 成交：${Number(stock.volume||0).toLocaleString()}張\n建議：${stock.adv?.tag} 評分：${stock.sc}%\n請給6條操作指令①②③④⑤⑥，風格像「週二操作指令」：\n①今日行情研判 ②明日操作策略 ③目標價或停損位 ④${stock.adv?.h==="長線"?"長線持有理由":"短線/不買理由"} ⑤在供應鏈的地位 ⑥最大風險`}]})});
      const d=await res.json();setDetailAI(d.content?.[0]?.text||"AI分析暫時無法取得。");
    }catch{setDetailAI("AI分析暫時無法取得。");}
    setAiLoading(false);
  },[]);

  const openStock=useCallback((stock)=>{setSelStock(stock);setView("detail");runAI(stock);},[runAI]);

  const savePreds=useCallback(async(p,today)=>{
    const pred={};
    STOCK_DB.forEach(s=>{const q=p[s.s];if(q?.p&&q?.ch!==undefined){const sc=scoreFn(q.ch,q.vol);pred[s.s]={sc,predUp:sc>=55,price:q.p,ch:q.ch,name:s.n};}});
    await stoSave(`pred:${today}`,pred);setPredictions(prev=>({...prev,[today]:pred}));
  },[]);

  // 模擬/即時計算準確率（用今日資料馬上顯示）
  const runMockTest=useCallback(async()=>{
    setAccLoading(true);
    const today=new Date().toLocaleDateString("zh-TW");
    const pred={};
    STOCK_DB.forEach(s=>{
      const q=prices[s.s];
      if(q?.p&&q?.ch!==undefined){
        const sc=scoreFn(q.ch,q.vol);
        pred[s.s]={sc,predUp:sc>=55,price:q.p,ch:q.ch,name:s.n};
      }
    });
    // 同時儲存今日預測（供明日比對）
    try{
      const str=JSON.stringify(pred);
      localStorage.setItem("pred:"+today,str);
      try{await window.storage.set("pred:"+today,str);}catch{}
    }catch{}
    setPredictions(prev=>({...prev,[today]:pred}));

    // 即時計算：用今日評分預測方向 vs 今日實際漲跌
    let ok=0,total=0;
    const stkAcc={};
    Object.entries(pred).forEach(([sym,p])=>{
      const q=prices[sym];if(!q||q.ch===undefined)return;
      const actualUp=q.ch>0;
      const correct=p.predUp===actualUp;
      if(correct)ok++;total++;
      if(!stkAcc[sym])stkAcc[sym]={name:p.name,ok:0,total:0};
      stkAcc[sym].ok+=(correct?1:0);
      stkAcc[sym].total++;
    });

    // 也嘗試從 localStorage 讀取歷史資料
    const dayRes=[];
    const allStkAcc={...stkAcc};
    let allOk=ok,allTotal=total;
    try{
      const histKeys=Object.keys(localStorage)
        .filter(k=>k.startsWith("pred:")&&k!=="pred:"+today)
        .sort().slice(-6);
      for(const key of histKeys){
        const dayPred=JSON.parse(localStorage.getItem(key)||"{}");
        let dOk=0,dAll=0;
        Object.entries(dayPred).forEach(([sym,p])=>{
          const q=prices[sym];if(!q||q.ch===undefined)return;
          const actualUp=q.ch>0;
          const correct=p.predUp===actualUp;
          if(correct)dOk++;dAll++;allOk+=(correct?1:0);allTotal++;
          if(!allStkAcc[sym])allStkAcc[sym]={name:p.name,ok:0,total:0};
          allStkAcc[sym].ok+=(correct?1:0);allStkAcc[sym].total++;
        });
        if(dAll>0)dayRes.push({
          date:key.replace("pred:",""),
          ok:dOk,total:dAll,
          rate:+((dOk/dAll)*100).toFixed(1)
        });
      }
    }catch{}

    // 加入今日
    if(total>0)dayRes.push({date:today+"(今日)",ok,total,rate:+((ok/total)*100).toFixed(1)});

    const list=Object.entries(allStkAcc)
      .filter(([,v])=>v.total>=1)
      .map(([sym,v])=>({sym,name:v.name,rate:+((v.ok/v.total)*100).toFixed(1),ok:v.ok,total:v.total}))
      .sort((a,b)=>b.rate-a.rate);

    setAccuracy({
      overall:allTotal>0?+((allOk/allTotal)*100).toFixed(1):null,
      totOk:allOk,totAll:allTotal,
      days:dayRes.slice(-7),
      best:list.slice(0,5),
      worst:list.slice(-5).reverse(),
      isMock:false
    });
    setAccLoading(false);
  },[prices]);

    const calcAcc=useCallback(async(cp)=>{
    setAccLoading(true);
    try{
      const days=[];
      for(let i=1;i<=14;i++){const d=new Date();d.setDate(d.getDate()-i);if(![0,6].includes(d.getDay()))days.push(d.toLocaleDateString("zh-TW"));}
      let totOk=0,totAll=0;const dayRes=[];const stkAcc={};
      for(const day of days.slice(0,7)){
        const pred=await stoLoad(`pred:${day}`);if(!pred)continue;
        let dOk=0,dAll=0;
        Object.entries(pred).forEach(([sym,p])=>{const q=cp[sym];if(!q?.ch)return;const aUp=q.ch>0;const ok=p.predUp===aUp;if(ok)dOk++;dAll++;totOk+=(ok?1:0);totAll++;
          if(!stkAcc[sym])stkAcc[sym]={name:p.name,ok:0,total:0};stkAcc[sym].ok+=(ok?1:0);stkAcc[sym].total++;});
        if(dAll>0)dayRes.push({date:day,ok:dOk,total:dAll,rate:+((dOk/dAll)*100).toFixed(1)});
      }
      const list=Object.entries(stkAcc).filter(([,v])=>v.total>=2)
        .map(([sym,v])=>({sym,name:v.name,rate:+((v.ok/v.total)*100).toFixed(1),ok:v.ok,total:v.total})).sort((a,b)=>b.rate-a.rate);
      setAccuracy({overall:totAll>0?+((totOk/totAll)*100).toFixed(1):null,totOk,totAll,days:dayRes,best:list.slice(0,5),worst:list.slice(-5).reverse()});
    }catch(e){console.error(e);}
    setAccLoading(false);
  },[]);

  const doUpdate=useCallback(async()=>{
    setUpdating(true);
    const today=new Date().toLocaleDateString("zh-TW");
    const now_h=new Date().getHours();
    const now_m=new Date().getMinutes();
    // 判斷是否盤中 9:00~13:30
    const inSession=(now_h>9||(now_h===9&&now_m>=0))&&(now_h<13||(now_h===13&&now_m<=30));
    let all={};let source="AI";

    // ── Step 1：優先嘗試 TWSE/TPEx 官方資料 ─────────────
    try{
      setUpdateMsg(inSession?"📡 盤中！連接證交所即時API…":"📡 連接台灣證交所收盤API…");
      const stockCodes=STOCK_DB.map(s=>s.s).join(",");
      const twseUrl=inSession
        ?`/api/twse?type=realtime&stocks=${stockCodes}`
        :"/api/twse";
      const twseRes=await fetch(twseUrl);
      if(twseRes.ok){
        const twseData=await twseRes.json();
        if(twseData?.data){
          const dataCount=Object.keys(twseData.data).length;
          // 取資料庫中有的股票
          STOCK_DB.forEach(s=>{
            if(twseData.data[s.s]){
              all[s.s]=twseData.data[s.s];
            }
          });
          const matched=Object.keys(all).length;
          if(matched>50){
            source=inSession?"TWSE即時":"TWSE收盤";
            setUpdateMsg(`✅ 證交所取得 ${dataCount} 支，匹配 ${matched} 支！`);
          }else{
            console.warn("TWSE matched too few:",matched,"from",dataCount);
            all={};// 重置，改用AI
          }
        }
      }
    }catch(e){
      console.warn("TWSE API failed:",e.message);
      all={};
    }

    // ── Step 2：TWSE 不足時改用 AI ───────────────────────
    if(Object.keys(all).length<50){
      setUpdateMsg("📡 證交所資料不足，改用 AI 更新…");
      const BATCH=40;
      const batches=[];
      for(let i=0;i<STOCK_DB.length;i+=BATCH)batches.push(STOCK_DB.slice(i,i+BATCH));
      try{
        for(let bi=0;bi<batches.length;bi++){
          const batch=batches[bi];
          setUpdateMsg(`🤖 AI更新 ${bi+1}/${batches.length} 批（${bi*BATCH+1}~${Math.min((bi+1)*BATCH,STOCK_DB.length)}支）`);
          const res=await fetch("/api/claude",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
              model:"claude-sonnet-4-20250514",
              max_tokens:2000,
              system:`只回傳純JSON物件，格式：{"2330":{"p":2310,"ch":0.87,"vol":6999},...}。絕對不含任何說明文字或markdown符號。`,
              messages:[{role:"user",content:`今天${today}，請提供這些台股最新收盤價：
${batch.map(s=>`${s.s}${s.n}`).join(",")}
p=收盤價(TWD整數),ch=今日漲跌幅%(保留2位小數,正負都要),vol=成交張數(整數)。只回傳JSON。`}]
            })
          });
          if(!res.ok){
            console.error("AI API error:",res.status);
            continue;
          }
          const d=await res.json();
          if(d.error){
            console.error("AI error:",d.error);
            continue;
          }
          const txt=d.content?.[0]?.text||"{}";
          const clean=txt.replace(/```json|```/g,"").replace(/^[^{]*/,"").replace(/[^}]*$/,"").trim();
          try{
            const parsed=JSON.parse(clean);
            Object.assign(all,parsed);
          }catch(e){
            console.error("JSON parse error:",e.message,"text:",txt.slice(0,100));
          }
        }
        if(Object.keys(all).length>50)source="AI估算";
      }catch(e){
        setUpdateMsg(`❌ 更新失敗：${e.message}`);
        setUpdating(false);
        return;
      }
    }

    // ── Step 3：套用資料 ─────────────────────────────────
    const matched=Object.keys(all).length;
    if(matched>10){
      const merged={...INIT_PRICES,...all};
      setPrices(merged);
      setDataDate(today);
      const now=new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"});
      setLastUpdate(now);
      setUpdateMsg(`✅ 更新完成！${matched}支 · ${source} · 收盤日：${today} · ${now}`);
      await calcAcc(merged);
      await savePreds(merged,today);
    }else{
      setUpdateMsg(`⚠️ 資料不足(${matched}支)，請稍後重試`);
    }
    setUpdating(false);
    setTimeout(()=>setUpdateMsg(""),8000);
  },[calcAcc,savePreds]);

  const scheduleNext=useCallback(()=>{
    if(timerRef.current)clearTimeout(timerRef.current);
    const now=new Date();const t=new Date(now);t.setHours(16,0,0,0);
    if(now>=t)t.setDate(t.getDate()+1);while([0,6].includes(t.getDay()))t.setDate(t.getDate()+1);
    setNextUpdate(t.toLocaleDateString("zh-TW",{month:"short",day:"numeric"})+" 16:00");
    timerRef.current=setTimeout(()=>{doUpdate();scheduleNext();},t-now);
  },[doUpdate]);

  useEffect(()=>{
    scheduleNext();
    (async()=>{
      try{
        const keys=await stoList("pred:");
        if(!keys.length)return;
        const loaded={};
        for(const k of keys.slice(-7)){
          const v=await stoLoad(k);
          if(v)loaded[k.replace("pred:","")]=v;
        }
        if(Object.keys(loaded).length){
          setPredictions(loaded);
          console.log("載入歷史預測:",Object.keys(loaded).length,"天");
        }
      }catch(e){console.error("載入預測失敗:",e);}
    })();
    const fn=e=>{if(catRef.current&&!catRef.current.contains(e.target))setCatOpen(false);};
    document.addEventListener("mousedown",fn);
    return()=>{document.removeEventListener("mousedown",fn);if(timerRef.current)clearTimeout(timerRef.current);};
  },[scheduleNext]);

  const stocks=useMemo(()=>STOCK_DB.map(s=>{
    const q=prices[s.s]||{p:0,ch:0,vol:0};const adv=getAdv(q.ch);const sc=scoreFn(q.ch,q.vol);
    const base=q.p*(1-q.ch/100)||q.p;
    const hist=Array.from({length:7},(_,i)=>+(base*(1+(q.ch/100)*(i/6)+Math.sin(i+(s.s.charCodeAt(0)||0))*0.008)).toFixed(1));
    return{...s,price:q.p,change:q.ch,volume:q.vol,adv,sc,hist};
  }),[prices]);

  const filtered=useMemo(()=>{
    let list=stocks;if(selCat!=="全部")list=list.filter(s=>s.cat===selCat);
    if(searchQ.trim()){const q=searchQ.toLowerCase();list=list.filter(s=>s.s.includes(q)||s.n.includes(q)||s.cat.toLowerCase().includes(q)||s.role.includes(q));}
    return [...list].sort((a,b)=>{const va=sortBy==="sc"?a.sc:sortBy==="ch"?a.change:sortBy==="p"?a.price:a.volume;const vb=sortBy==="sc"?b.sc:sortBy==="ch"?b.change:sortBy==="p"?b.price:b.volume;return sortDir*(vb-va);});
  },[stocks,selCat,searchQ,sortBy,sortDir]);

  const dropList=useMemo(()=>{if(!searchQ.trim())return[];const q=searchQ.toLowerCase();return stocks.filter(s=>s.s.includes(q)||s.n.includes(q)||s.cat.toLowerCase().includes(q)||s.role.includes(q)).slice(0,10);},[searchQ,stocks]);
  const top8=useMemo(()=>[...stocks].filter(s=>s.price>0).sort((a,b)=>b.sc-a.sc).slice(0,8),[stocks]);
  const catStats=useMemo(()=>{const m={};CATS.slice(1).forEach(c=>{const cs=stocks.filter(s=>s.cat===c&&s.price>0);m[c]={avg:cs.length?+(cs.reduce((a,s)=>a+s.change,0)/cs.length).toFixed(2):0,count:cs.length};});return m;},[stocks]);
  const ticker=stocks.filter(s=>s.price>0).slice(0,24);
  const sp=f=>{if(sortBy===f)setSortDir(d=>-d);else{setSortBy(f);setSortDir(-1);}};
  const selPos=(selStock?.change??0)>=0;

  return(
    <div style={{minHeight:"100vh",background:"#f0f4f8",fontFamily:"'Noto Sans TC',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;700;900&display=swap');
        @keyframes scroll-left{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(.85)}50%{opacity:1;transform:scale(1.15)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes prog{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .rh{transition:background .1s;cursor:pointer}.rh:hover{background:#f0fdfa!important}
        .cb{transition:all .15s;cursor:pointer}input{outline:none}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
      `}</style>

      <header style={{background:"linear-gradient(90deg,#0f2027,#1a3a4a)",position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 16px rgba(0,0,0,.45)"}}>
        <div style={{display:"flex",alignItems:"center",height:50,padding:"0 14px",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setView("home")}>
            <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#14b8a6,#0284c7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#fff",boxShadow:"0 3px 10px rgba(20,184,166,.5)"}}>台</div>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#f0fdfa",lineHeight:1.2}}>台股 AI 操作指令</div>
              <div style={{fontSize:12,color:"#5eead4"}}>{STOCK_DB.length}支 · 收盤：{dataDate}{lastUpdate?` 更新${lastUpdate}`:""}</div>
            </div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            <div style={{textAlign:"right",fontSize:10,color:"#4a6080",lineHeight:1.6}}>
              <div>每日PM4:00自動更新</div>
              <div style={{color:"#00b4d8",fontWeight:700}}>下次：{nextUpdate}</div>
            </div>
            <button onClick={()=>setAccView(v=>!v)} style={{background:accView?"rgba(251,191,36,.2)":"rgba(255,255,255,.07)",border:`1px solid ${accView?"#fbbf24":"rgba(255,255,255,.1)"}`,borderRadius:8,padding:"5px 10px",color:accView?"#fbbf24":"#94a3b8",fontSize:13,cursor:"pointer",fontWeight:accView?700:400}}>
              📊 準確率
            </button>
            <button onClick={doUpdate} disabled={updating} style={{background:updating?"rgba(20,184,166,.15)":"linear-gradient(135deg,#14b8a6,#0284c7)",border:updating?"1px solid #14b8a6":"none",borderRadius:9,padding:"7px 16px",color:"#fff",fontSize:14,cursor:updating?"wait":"pointer",display:"flex",alignItems:"center",gap:6,fontWeight:800,boxShadow:updating?"none":"0 3px 12px rgba(20,184,166,.4)"}}>
              {updating?<><Spin size={12} color="#5eead4"/>更新中</>:"🔄 立即更新"}
            </button>
          </div>
        </div>
        {(updating||updateMsg)&&(
          <div style={{padding:"5px 14px",display:"flex",alignItems:"center",gap:8,background:updateMsg.startsWith("✅")?"#052e16":updateMsg.startsWith("❌")?"#450a0a":"#0a1e30",borderTop:"1px solid rgba(255,255,255,.06)"}}>
            {updating&&<div style={{flex:1,height:3,background:"#1a3a4a",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,#14b8a6,#0284c7,#14b8a6)",backgroundSize:"200% 100%",animation:"prog 1.5s linear infinite",borderRadius:3}}/></div>}
            <span style={{fontSize:13,fontWeight:600,color:updateMsg.startsWith("✅")?"#34d399":updateMsg.startsWith("❌")?"#f87171":"#7dd3fc",whiteSpace:"nowrap"}}>{updateMsg}</span>
          </div>
        )}
      </header>

      <div style={{background:"#0f2027",overflow:"hidden",height:22,display:"flex",alignItems:"center",borderBottom:"1px solid #1e3a4a"}}>
        <span style={{flexShrink:0,fontSize:10,color:"#5eead4",padding:"0 8px",borderRight:"1px solid #1e3a4a",fontWeight:700,whiteSpace:"nowrap"}}>{dataDate}</span>
        <div style={{overflow:"hidden",flex:1}}>
          <div style={{display:"inline-flex",animation:"scroll-left 80s linear infinite",whiteSpace:"nowrap"}}>
            {[...ticker,...ticker].map((s,i)=>(
              <span key={i} style={{fontSize:12,color:s.change>=0?"#ff6666":"#4ade80",padding:"0 12px",borderRight:"1px solid #1e3a4a"}}>
                {s.s} {s.n} {s.price} {s.change>=0?"▲":"▼"}{Math.abs(s.change).toFixed(2)}%
              </span>
            ))}
          </div>
        </div>
      </div>

      {accView&&(
        <div style={{background:"#0a1628",borderBottom:"2px solid #fbbf24",padding:"16px",maxHeight:"55vh",overflowY:"auto"}}>
          <div style={{maxWidth:1000,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{fontSize:15,fontWeight:800,color:"#fbbf24"}}>📊 AI 預測準確率{accuracy?.isMock?" (模擬測試)":""}</span>
              <span style={{fontSize:12,color:"#4a6080"}}>每日更新後自動比對昨日預測 vs 今日實際漲跌</span>
              <button onClick={()=>runMockTest()} disabled={accLoading} style={{marginLeft:"auto",background:"rgba(251,191,36,.15)",border:"1px solid #fbbf24",borderRadius:7,padding:"3px 10px",color:"#fbbf24",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                {accLoading?<><Spin size={10} color="#fbbf24"/>計算中</>:"🔄 重算"}
              </button>
              <button onClick={()=>setAccView(false)} style={{background:"none",border:"none",color:"#4a6080",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            {accLoading&&<div style={{display:"flex",justifyContent:"center",padding:"20px",gap:8,alignItems:"center"}}><Spin size={20} color="#fbbf24"/><span style={{color:"#4a6080",fontSize:16}}>分析中…</span></div>}
            {!accLoading&&!accuracy&&(
              <div style={{textAlign:"center",padding:"20px",color:"#4a6080"}}>
                <div style={{fontSize:28,marginBottom:8}}>📭</div>
                <div style={{fontSize:16,color:"#c8ddf0",marginBottom:6}}>尚無歷史比對資料</div>
                <div style={{fontSize:14,lineHeight:1.8,marginBottom:12}}>
                  準確率系統需要<strong style={{color:"#fbbf24"}}>至少連續2天更新</strong>才能運作：<br/>
                  第1天：按「🔄 立即更新」→ 系統儲存今日預測<br/>
                  第2天：再按「🔄 立即更新」→ 自動比對昨日預測 vs 今日實際
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"center"}}>
                  <div style={{fontSize:13,color:"#2a4060",background:"#0d1f30",borderRadius:8,padding:"8px 16px",textAlign:"left",maxWidth:340}}>
                    💡 目前狀態：系統已在你每次更新時儲存預測紀錄<br/>
                    儲存位置：瀏覽器 localStorage（重整不會消失）<br/>
                    下次更新後即可看到準確率數字
                  </div>
                  <button onClick={()=>runMockTest()} style={{background:"rgba(251,191,36,.15)",border:"1px solid #fbbf24",borderRadius:8,padding:"6px 16px",color:"#fbbf24",fontSize:14,cursor:"pointer",marginTop:4}}>
                    🧪 用今日資料模擬測試（查看功能是否正常）
                  </button>
                </div>
              </div>
            )}
            {!accLoading&&accuracy&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:14}}>
                  {[
                    {l:"整體準確率",v:accuracy.overall!==null?`${accuracy.overall}%`:"—",c:accuracy.overall>=60?"#10b981":accuracy.overall>=50?"#f59e0b":"#f87171",sub:`共${accuracy.totAll}次`},
                    {l:"正確次數",v:accuracy.totOk,c:"#10b981",sub:"次"},
                    {l:"錯誤次數",v:accuracy.totAll-accuracy.totOk,c:"#f87171",sub:"次"},
                    {l:"分析天數",v:accuracy.days.length,c:"#7dd3fc",sub:"交易日"},
                  ].map((card,i)=>(
                    <div key={i} style={{background:"#0d1f30",borderRadius:10,padding:"12px",border:`1px solid ${card.c}33`,textAlign:"center"}}>
                      <div style={{fontSize:12,color:"#4a6080",marginBottom:5}}>{card.l}</div>
                      <div style={{fontSize:22,fontWeight:900,color:card.c}}>{card.v}</div>
                      <div style={{fontSize:12,color:"#4a6080",marginTop:2}}>{card.sub}</div>
                    </div>
                  ))}
                </div>
                {accuracy.days.length>0&&(
                  <div style={{background:"#0d1f30",borderRadius:10,padding:"12px",marginBottom:10}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#c8ddf0",marginBottom:8}}>📅 每日準確率</div>
                    {accuracy.days.map((d,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                        <span style={{fontSize:12,color:"#4a6080",width:55,flexShrink:0}}>{d.date}</span>
                        <div style={{flex:1,height:14,background:"#1a2d40",borderRadius:6,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${d.rate}%`,background:d.rate>=60?"linear-gradient(90deg,#10b981,#34d399)":d.rate>=50?"linear-gradient(90deg,#f59e0b,#fbbf24)":"linear-gradient(90deg,#f87171,#fca5a5)",borderRadius:6}}/>
                        </div>
                        <span style={{fontSize:13,fontWeight:700,color:d.rate>=60?"#10b981":d.rate>=50?"#f59e0b":"#f87171",width:34,textAlign:"right"}}>{d.rate}%</span>
                        <span style={{fontSize:12,color:"#4a6080",width:44,textAlign:"right"}}>{d.ok}/{d.total}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {accuracy.best.length>0&&(
                    <div style={{background:"#0d1f30",borderRadius:10,padding:"12px",border:"1px solid #10b98133"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#10b981",marginBottom:8}}>🏆 最準確</div>
                      {accuracy.best.map((s,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",padding:"4px 0",borderBottom:i<accuracy.best.length-1?"1px solid #1a2d40":"none"}}>
                          <span style={{fontSize:12,color:"#4a6080",width:14}}>{i+1}</span>
                          <span style={{fontSize:14,fontWeight:600,color:"#c8ddf0",flex:1}}>{s.name}</span>
                          <span style={{fontSize:12,color:"#4a6080",marginRight:5}}>{s.sym}</span>
                          <span style={{fontSize:16,fontWeight:800,color:"#10b981"}}>{s.rate}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {accuracy.worst.length>0&&(
                    <div style={{background:"#0d1f30",borderRadius:10,padding:"12px",border:"1px solid #f8717133"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#f87171",marginBottom:8}}>⚠️ 最不準</div>
                      {accuracy.worst.map((s,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",padding:"4px 0",borderBottom:i<accuracy.worst.length-1?"1px solid #1a2d40":"none"}}>
                          <span style={{fontSize:12,color:"#4a6080",width:14}}>{i+1}</span>
                          <span style={{fontSize:14,fontWeight:600,color:"#c8ddf0",flex:1}}>{s.name}</span>
                          <span style={{fontSize:12,color:"#4a6080",marginRight:5}}>{s.sym}</span>
                          <span style={{fontSize:16,fontWeight:800,color:"#f87171"}}>{s.rate}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {view==="home"&&(
        <>
          <div style={{background:"linear-gradient(150deg,#0f2027,#164e63 55%,#155e75)",padding:"28px 16px 36px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse at 20% 80%,rgba(20,184,166,.1) 0%,transparent 50%)",pointerEvents:"none"}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{display:"inline-block",fontSize:12,color:"#5eead4",letterSpacing:2,border:"1px solid rgba(94,234,212,.3)",borderRadius:20,padding:"3px 14px",marginBottom:10,fontWeight:600}}>
                台積電+SpaceX衛星供應鏈 {STOCK_DB.length}支 · 每日PM4自動更新
              </div>
              <h1 style={{fontSize:"clamp(17px,3.8vw,26px)",fontWeight:900,color:"#f0fdfa",margin:"0 0 5px"}}>台股 AI 操作指令中心</h1>
              <p style={{fontSize:14,color:"#7dd3fc",margin:"0 0 20px"}}>含昇達科/華通/燿華/同欣電/璟德/德律等 · 長線/短線/勿買 · {dataDate}</p>
              <div style={{maxWidth:540,margin:"0 auto",position:"relative"}}>
                <div style={{display:"flex",background:"#fff",borderRadius:14,boxShadow:"0 8px 30px rgba(0,0,0,.3)",border:"2px solid rgba(20,184,166,.4)"}}>
                  <span style={{padding:"0 12px",display:"flex",alignItems:"center",color:"#64748b",fontSize:17,flexShrink:0}}>🔍</span>
                  <input value={searchQ} onChange={e=>{setSearchQ(e.target.value);setShowDrop(!!e.target.value);}}
                    onFocus={()=>dropList.length>0&&setShowDrop(true)} onBlur={()=>setTimeout(()=>setShowDrop(false),180)}
                    placeholder="代號/公司名/產業 (3491、昇達科、衛星、散熱、德律)"
                    style={{flex:1,border:"none",padding:"13px 0",fontSize:16,color:"#1e293b",background:"transparent",minWidth:0}}/>
                  {searchQ&&<button onClick={()=>{setSearchQ("");setShowDrop(false);}} style={{padding:"0 12px",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:17,flexShrink:0}}>✕</button>}
                </div>
                {showDrop&&dropList.length>0&&(
                  <div style={{position:"absolute",top:"calc(100% + 5px)",left:0,right:0,background:"#fff",borderRadius:12,boxShadow:"0 16px 48px rgba(0,0,0,.22)",zIndex:400,overflow:"hidden",border:"1px solid #e2e8f0",maxHeight:340,overflowY:"auto"}}>
                    {dropList.map((s,i)=>{const pos=s.change>=0;return(
                      <div key={s.s} onMouseDown={()=>{openStock(s);setSearchQ("");setShowDrop(false);}}
                        style={{display:"flex",alignItems:"center",padding:"10px 14px",cursor:"pointer",borderBottom:i<dropList.length-1?"1px solid #f1f5f9":"none",background:"#fff"}}
                        onMouseEnter={e=>e.currentTarget.style.background="#f0fdfa"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                        <div style={{width:34,height:34,borderRadius:7,background:"linear-gradient(135deg,#0f2027,#155e75)",display:"flex",alignItems:"center",justifyContent:"center",color:"#5eead4",fontSize:13,fontWeight:800,marginRight:10,flexShrink:0}}>{s.s.slice(0,2)}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                            <span style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>{s.n}</span>
                            <span style={{fontSize:13,color:"#64748b",fontWeight:600}}>{s.s}</span>
                            <span style={{fontSize:12,padding:"1px 6px",borderRadius:7,background:s.adv.bg,color:s.adv.c,border:`1px solid ${s.adv.bd}`,fontWeight:700}}>{s.adv.icon}{s.adv.trade}</span>
                          </div>
                          <div style={{fontSize:12,color:"#94a3b8"}}>{s.cat}·{s.role}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:14,fontWeight:800,color:pos?"#e00000":"#16a34a"}}>{s.price||"-"}</div>
                          <div style={{fontSize:13,color:pos?"#e00000":"#16a34a"}}>{pos?"▲":"▼"}{Math.abs(s.change).toFixed(2)}%</div>
                        </div>
                      </div>
                    );})}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",boxShadow:"0 1px 6px rgba(0,0,0,.06)"}}>
            <div style={{display:"flex",alignItems:"stretch",overflowX:"auto"}}>
              <div ref={catRef} style={{position:"relative",flexShrink:0}}>
                <button onClick={()=>setCatOpen(v=>!v)} style={{display:"flex",alignItems:"center",gap:5,background:catOpen?"#f0fdfa":"transparent",border:"none",borderBottom:catOpen?"2px solid #14b8a6":"2px solid transparent",padding:"10px 12px",color:catOpen?"#14b8a6":"#475569",fontSize:14,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",height:"100%"}}>
                  ☰ 選產業 <span style={{fontSize:12,display:"inline-block",transform:catOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>▼</span>
                </button>
                {catOpen&&(
                  <div style={{position:"absolute",top:"calc(100% + 1px)",left:0,background:"#fff",borderRadius:12,boxShadow:"0 12px 40px rgba(0,0,0,.18)",zIndex:500,border:"1px solid #e2e8f0",minWidth:240,maxHeight:"75vh",overflowY:"auto"}}>
                    {CATS.map(c=>{const st=catStats[c];const isSel=selCat===c;return(
                      <div key={c} onMouseDown={()=>{setSelCat(c);if(c==="全部"){setCatOpen(false);setSubCat(null);}else setSubCat(subCat===c?null:c);}}
                        style={{display:"flex",alignItems:"center",padding:"10px 14px",cursor:"pointer",background:isSel?"#f0fdfa":"#fff",borderLeft:isSel?"3px solid #14b8a6":"3px solid transparent",borderBottom:"1px solid #f1f5f9"}}
                        onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=isSel?"#f0fdfa":"#fff"}>
                        <span style={{flex:1,fontSize:16,fontWeight:isSel?700:400,color:isSel?"#0f172a":"#334155"}}>{c==="全部"?"🏠 全部產業":c}</span>
                        {st&&<><span style={{fontSize:12,color:"#94a3b8",marginRight:6}}>{st.count}支</span><span style={{fontSize:13,fontWeight:600,color:st.avg>=0?"#059669":"#dc2626",marginRight:4}}>{st.avg>=0?"+":""}{st.avg}%</span></>}
                        {c!=="全部"&&<span style={{fontSize:12,color:"#94a3b8"}}>{subCat===c?"▲":"▼"}</span>}
                      </div>
                    );})}
                    {subCat&&subCat!=="全部"&&(
                      <div style={{background:"#f8fafc",borderTop:"2px solid #14b8a6"}}>
                        <div style={{padding:"5px 14px",fontSize:12,color:"#14b8a6",fontWeight:700}}>▼ {subCat}（點擊直接分析）</div>
                        {STOCK_DB.filter(s=>s.cat===subCat).map(s=>{
                          const q=prices[s.s]||{};const pos=(q.ch??0)>=0;const adv=getAdv(q.ch??0);
                          const enr={...s,price:q.p||0,change:q.ch||0,volume:q.vol||0,hist:[],adv,sc:scoreFn(q.ch||0,q.vol||0)};
                          return(
                            <div key={s.s} onMouseDown={()=>{openStock(enr);setCatOpen(false);setSubCat(null);}}
                              style={{display:"flex",alignItems:"center",padding:"8px 14px 8px 20px",cursor:"pointer",borderBottom:"1px solid #f1f5f9",background:"#f8fafc"}}
                              onMouseEnter={e=>e.currentTarget.style.background="#f0fdfa"} onMouseLeave={e=>e.currentTarget.style.background="#f8fafc"}>
                              <div style={{flex:1}}>
                                <div style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>{s.n} <span style={{fontSize:12,color:"#94a3b8",fontWeight:400}}>{s.s}</span></div>
                                <div style={{fontSize:12,color:"#94a3b8"}}>{s.role}</div>
                              </div>
                              <div style={{textAlign:"right",marginRight:8}}>
                                {q.p?<><div style={{fontSize:16,fontWeight:800,color:pos?"#e00000":"#16a34a"}}>{q.p}</div><div style={{fontSize:12,color:pos?"#e00000":"#16a34a"}}>{pos?"▲":"▼"}{Math.abs(q.ch||0).toFixed(2)}%</div></>:<div style={{fontSize:12,color:"#cbd5e1"}}>—</div>}
                              </div>
                              <span style={{fontSize:12,padding:"2px 7px",borderRadius:7,background:adv.bg,color:adv.c,border:`1px solid ${adv.bd}`,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>{adv.icon}{adv.trade}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{display:"flex",overflowX:"auto",flex:1}}>
                {CATS.map(c=>{const isSel=selCat===c;const st=catStats[c];return(
                  <button key={c} onClick={()=>setSelCat(c)} className="cb"
                    style={{padding:"10px 10px",border:"none",borderBottom:isSel?"2px solid #14b8a6":"2px solid transparent",background:"transparent",color:isSel?"#14b8a6":"#64748b",fontSize:13,fontWeight:isSel?700:400,whiteSpace:"nowrap",display:"flex",flexDirection:"column",alignItems:"center",gap:1,flexShrink:0}}>
                    {c==="全部"?"全部":c}
                    {st&&<span style={{fontSize:9,color:st.avg>=0?"#10b981":"#f87171"}}>{st.avg>=0?"+":""}{st.avg}%</span>}
                  </button>
                );})}
              </div>
            </div>
          </div>

          <div style={{maxWidth:1100,margin:"0 auto",padding:"12px 12px 48px",width:"100%",boxSizing:"border-box"}}>
            {selCat==="全部"&&!searchQ&&(
              <>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:4,height:22,background:"linear-gradient(180deg,#14b8a6,#0284c7)",borderRadius:4}}/>
                  <div style={{fontSize:15,fontWeight:800,color:"#0f172a"}}>今日 AI 精選 Top 8</div>
                  <span style={{fontSize:12,color:"#94a3b8"}}>評分最高·{dataDate}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:9,marginBottom:20}}>
                  {top8.map((s,idx)=>{const pos=s.change>=0;const rc=s.sc>=80?"#10b981":s.sc>=65?"#f59e0b":"#6366f1";return(
                    <div key={s.s} onClick={()=>openStock(s)}
                      style={{background:"#fff",borderRadius:14,overflow:"hidden",cursor:"pointer",boxShadow:"0 4px 14px rgba(0,0,0,.09)",border:"1px solid #e2e8f0",animation:`fadeUp .35s ${idx*.04}s both`,transition:"transform .18s,box-shadow .18s"}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,.12)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,.09)";}}>
                      <div style={{height:3,background:`linear-gradient(90deg,${rc},${rc}66)`}}/>
                      <div style={{padding:"10px 12px 0"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <div style={{display:"flex",gap:4}}>
                            <span style={{fontSize:12,padding:"2px 6px",borderRadius:8,background:rc+"20",color:rc,fontWeight:700}}>#{idx+1}</span>
                            <span style={{fontSize:12,padding:"2px 6px",borderRadius:8,background:s.adv.bg,color:s.adv.c,border:`1px solid ${s.adv.bd}`,fontWeight:700}}>{s.adv.icon}{s.adv.trade}</span>
                          </div>
                          <span style={{fontSize:10,color:"#94a3b8"}}>{s.cat}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                          <div>
                            <div style={{fontSize:16,fontWeight:900,color:"#0f172a"}}>{s.n}</div>
                            <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{s.s}</div>
                            <div style={{fontSize:10,color:"#94a3b8",marginBottom:4,maxWidth:110,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.role}</div>
                            <div style={{display:"flex",alignItems:"baseline",gap:5}}>
                              <span style={{fontSize:18,fontWeight:900,color:pos?"#e00000":"#16a34a"}}>{s.price||"—"}</span>
                              <span style={{fontSize:13,color:pos?"#e00000":"#16a34a",fontWeight:700}}>{pos?"▲":"▼"}{Math.abs(s.change).toFixed(2)}%</span>
                            </div>
                          </div>
                          <Ring score={s.sc} size={54}/>
                        </div>
                      </div>
                      <div style={{margin:"6px 0 0"}}><Spark prices={s.hist} color={s.sc>=65?"#14b8a6":"#f87171"} h={32}/></div>
                      <div style={{padding:"5px 12px 8px"}}>
                        <div style={{background:s.adv.bg,borderRadius:6,padding:"3px 7px",fontSize:12,color:s.adv.c,fontWeight:700,textAlign:"center",border:`1px solid ${s.adv.bd}`}}>{s.adv.tag}</div>
                      </div>
                    </div>
                  );})}
                </div>
              </>
            )}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <div style={{width:4,height:20,background:"linear-gradient(180deg,#14b8a6,#0284c7)",borderRadius:4}}/>
              <span style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{selCat==="全部"?`完整供應鏈 (${STOCK_DB.length}支)`:selCat}</span>
              <span style={{fontSize:12,color:"#94a3b8"}}>顯示 {filtered.length} 支</span>
              <div style={{marginLeft:"auto",display:"flex",gap:4,flexWrap:"wrap"}}>
                {[["sc","評分"],["ch","漲跌"],["p","股價"],["vol","成交"]].map(([f,l])=>(
                  <button key={f} onClick={()=>sp(f)} style={{background:sortBy===f?"#0f2027":"#f1f5f9",border:`1px solid ${sortBy===f?"#14b8a6":"#e2e8f0"}`,borderRadius:6,padding:"3px 8px",color:sortBy===f?"#5eead4":"#64748b",fontSize:12,cursor:"pointer",fontWeight:sortBy===f?700:400}}>
                    {l}{sortBy===f?(sortDir>0?"↑":"↓"):""}
                  </button>
                ))}
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.08)",border:"1px solid #e2e8f0"}}>
              <div style={{display:"grid",gridTemplateColumns:"24px 128px 50px 58px 52px 58px 116px 82px 48px",alignItems:"center",padding:"7px 10px",background:"linear-gradient(90deg,#0f2027,#1a3a4a)"}}>
                {["#","公司名稱","代號","股價","漲跌","成交張","操作指令","建議","評分"].map((h,i)=>(
                  <div key={i} style={{fontSize:10,color:"#7dd3fc",fontWeight:600,textAlign:i>=3?"right":"left",paddingRight:i>=3&&i<8?4:0}}>{h}</div>
                ))}
              </div>
              {filtered.map((s,i)=>{
                const pos=s.change>=0;const rc=s.sc>=80?"#10b981":s.sc>=65?"#f59e0b":"#94a3b8";const hs=hStyle(s.adv.h);
                return(
                  <div key={`${s.s}_${i}`} className="rh" onClick={()=>openStock(s)}
                    style={{display:"grid",gridTemplateColumns:"24px 128px 50px 58px 52px 58px 116px 82px 48px",alignItems:"center",padding:"8px 10px",borderBottom:i<filtered.length-1?"1px solid #f1f5f9":"none",background:"#fff",animation:`fadeUp .28s ${Math.min(i,25)*.018}s both`}}>
                    <span style={{fontSize:12,color:"#e2e8f0"}}>{i+1}</span>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:16,fontWeight:700,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.n}</div>
                      <div style={{fontSize:10,color:"#94a3b8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.cat}</div>
                    </div>
                    <div style={{fontSize:13,color:"#475569",fontWeight:700}}>{s.s}</div>
                    <div style={{textAlign:"right",fontSize:16,fontWeight:800,color:pos?"#e00000":"#16a34a",paddingRight:4}}>{s.price||"-"}</div>
                    <div style={{textAlign:"right",fontSize:13,fontWeight:700,color:pos?"#e00000":"#16a34a",paddingRight:3}}>{pos?"▲":"▼"}{Math.abs(s.change).toFixed(2)}%</div>
                    <div style={{textAlign:"right",fontSize:12,color:"#64748b",paddingRight:3}}>{Number(s.volume||0).toLocaleString()}</div>
                    <div style={{textAlign:"center",paddingRight:2}}>
                      <span style={{fontSize:12,padding:"2px 5px",borderRadius:6,background:s.adv.bg,color:s.adv.c,border:`1px solid ${s.adv.bd}`,fontWeight:700,whiteSpace:"nowrap"}}>{s.adv.icon} {s.adv.tag}</span>
                    </div>
                    <div style={{textAlign:"center",paddingRight:2}}>
                      <span style={{fontSize:12,padding:"2px 6px",borderRadius:7,fontWeight:800,...hs}}>{hLabel(s.adv.h)}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontWeight:800,color:rc}}>{s.sc}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:10,background:"#fff",borderRadius:10,padding:"10px 14px",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:6}}>📋 操作建議說明</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {[{bg:"#f0fdf4",c:"#16a34a",bd:"#86efac",t:"🟢 長線"},{bg:"#fff7ed",c:"#ea580c",bd:"#fdba74",t:"🟠 短線"},{bg:"#ecfeff",c:"#0891b2",bd:"#67e8f9",t:"🔵 低點布局"},{bg:"#f5f3ff",c:"#7c3aed",bd:"#c4b5fd",t:"🟣 等拉回"},{bg:"#f8fafc",c:"#64748b",bd:"#cbd5e1",t:"⚪ 觀望"},{bg:"#fffbeb",c:"#b45309",bd:"#fde68a",t:"🟡 趨勢弱"},{bg:"#fef2f2",c:"#dc2626",bd:"#fca5a5",t:"🔴 賣出/別碰"}].map((x,i)=>(
                  <span key={i} style={{fontSize:12,padding:"3px 8px",borderRadius:7,background:x.bg,color:x.c,border:`1px solid ${x.bd}`,fontWeight:600}}>{x.t}</span>
                ))}
              </div>
            </div>
            <div style={{marginTop:6,fontSize:12,color:"#94a3b8",textAlign:"center"}}>⚠️ AI生成，僅供參考，不構成投資建議。股價為 <span style={{color:"#fbbf24",fontWeight:600}}>{dataDate} 收盤價</span>，每日PM4:00自動更新，或按「🔄 立即更新」手動更新。</div>
          </div>
        </>
      )}

      {view==="detail"&&selStock&&(
        <div style={{flex:1}}>
          <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"9px 14px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:50,zIndex:100}}>
            <button onClick={()=>setView("home")} style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:8,padding:"5px 13px",color:"#475569",fontSize:14,cursor:"pointer",fontWeight:700}}>← 返回</button>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>{selStock.n}（{selStock.s}）· {selStock.cat}</div>
              <div style={{fontSize:12,color:"#94a3b8"}}>{selStock.role}</div>
            </div>
          </div>
          <div style={{maxWidth:820,margin:"0 auto",padding:"14px 14px 48px",display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:"linear-gradient(135deg,#0f2027,#164e63 60%,#155e75)",borderRadius:18,padding:"20px 20px 16px",color:"#fff"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,padding:"2px 8px",borderRadius:8,background:"rgba(20,184,166,.2)",color:"#5eead4",border:"1px solid rgba(20,184,166,.3)"}}>{selStock.cat}</span>
                    <span style={{fontSize:12,color:"#7dd3fc"}}>{selStock.role}</span>
                  </div>
                  <div style={{fontSize:20,fontWeight:900,color:"#f0fdfa"}}>{selStock.n} <span style={{fontSize:16,color:"#7dd3fc",fontWeight:400}}>({selStock.s})</span></div>
                  <div style={{display:"flex",alignItems:"baseline",gap:8,marginTop:8}}>
                    <span style={{fontSize:30,fontWeight:900,color:selPos?"#ff4444":"#4ade80"}}>{selStock.price||"—"}</span>
                    <span style={{fontSize:16,color:"#7dd3fc"}}>TWD</span>
                    <span style={{fontSize:14,fontWeight:700,padding:"2px 10px",borderRadius:7,background:selPos?"rgba(220,0,0,.15)":"rgba(74,222,128,.15)",color:selPos?"#ff4444":"#4ade80"}}>
                      {selPos?"▲":"▼"}{Math.abs(selStock.change??0).toFixed(2)}%
                    </span>
                  </div>
                  <div style={{fontSize:12,color:"#5eead4",marginTop:3}}>成交 {Number(selStock.volume||0).toLocaleString()} 張 · <span style={{color:"#fbbf24",fontWeight:600}}>收盤日期：{dataDate}</span></div>
                </div>
                <div style={{textAlign:"center",background:selStock.adv.bg,borderRadius:12,padding:"12px 16px",border:`2px solid ${selStock.adv.bd}`,minWidth:120}}>
                  <div style={{fontSize:20}}>{selStock.adv.icon}</div>
                  <div style={{fontSize:14,fontWeight:900,color:selStock.adv.c,marginTop:3}}>{selStock.adv.tag}</div>
                  <div style={{marginTop:6,fontSize:14,fontWeight:800,padding:"3px 10px",borderRadius:8,background:selStock.adv.c,color:"#fff",display:"inline-block"}}>{hLabel(selStock.adv.h)}</div>
                  <div style={{marginTop:5,fontSize:13,color:selStock.adv.c,fontWeight:600}}>明日評分 {selStock.sc}%</div>
                </div>
              </div>
            </div>
            {/* K線圖 */}
            <div style={{background:"#fff",borderRadius:16,padding:"16px 18px",boxShadow:"0 4px 18px rgba(0,0,0,.08)",border:"1px solid #e8f0fe"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#7c3aed,#2563eb)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🕯️</div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:"#0f172a"}}>K線走勢圖</div>
                  <div style={{fontSize:12,color:"#94a3b8"}}>近20日 K線 · MA5(黃) · MA10(藍) · MA20(粉)</div>
                </div>
              </div>
              <CandleChart sym={selStock.s} currentPrice={selStock.price} currentCh={selStock.change}/>
            </div>

            {/* 技術分析 */}
            <TechAnalysis stock={selStock}/>

            {/* AI操作指令 */}
            <div style={{background:"#fff",borderRadius:16,padding:"16px 18px",boxShadow:"0 4px 18px rgba(0,0,0,.08)",border:"1px solid #e8f0fe"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#14b8a6,#0284c7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:"#0f172a"}}>AI 操作指令</div>
                  <div style={{fontSize:12,color:"#94a3b8"}}>仿「週二操作指令」風格 · Claude AI</div>
                </div>
              </div>
              {aiLoading?<div style={{display:"flex",gap:5,alignItems:"center",padding:"6px 0"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#14b8a6",animation:`pulse 1.2s ${i*.2}s infinite`}}/>)}<span style={{fontSize:14,color:"#94a3b8",marginLeft:4}}>AI 分析中…</span></div>
              :<div style={{fontSize:16,color:"#1e293b",lineHeight:1.9,whiteSpace:"pre-wrap"}}>{detailAI}</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[{l:"公司名稱",v:selStock.n,c:"#0f172a"},{l:"股票代號",v:selStock.s,c:"#0891b2"},{l:"所屬類別",v:selStock.cat,c:"#7c3aed"},
                {l:"供應鏈角色",v:selStock.role,c:"#059669"},{l:"今日收盤",v:`${selStock.price} 元`,c:selPos?"#059669":"#dc2626"},
                {l:"今日漲跌",v:`${selPos?"▲":"▼"}${Math.abs(selStock.change??0).toFixed(2)}%`,c:selPos?"#059669":"#dc2626"},
                {l:"操作建議",v:selStock.adv?.tag,c:selStock.adv?.c},{l:"投資風格",v:selStock.adv?.trade,c:"#0f2027"},
                {l:"明日機率",v:`${selStock.sc}%`,c:selStock.sc>=75?"#10b981":selStock.sc>=60?"#f59e0b":"#94a3b8"},
              ].map((x,i)=>(
                <div key={i} style={{background:"#fff",borderRadius:10,padding:"10px 12px",boxShadow:"0 2px 8px rgba(0,0,0,.06)",border:"1px solid #f1f5f9"}}>
                  <div style={{fontSize:10,color:"#94a3b8",marginBottom:3}}>{x.l}</div>
                  <div style={{fontSize:14,fontWeight:700,color:x.c,lineHeight:1.3}}>{x.v||"-"}</div>
                </div>
              ))}
            </div>
            <div style={{textAlign:"center",fontSize:12,color:"#94a3b8"}}>⚠️ AI生成，僅供參考，不構成投資建議。</div>
          </div>
        </div>
      )}

      <footer style={{background:"#0f2027",color:"#334155",textAlign:"center",padding:"10px",fontSize:12}}>
        台積電+低軌衛星AI供應鏈 · {STOCK_DB.length}支 · {dataDate} · PM4自動更新 · 不構成投資建議
      </footer>
    </div>
  );
}

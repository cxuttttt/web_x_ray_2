/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScanItem, LiveDetectLog, TrainingVersion, ReportItem, NotificationItem } from './types';

export const INITIAL_SCANS: ScanItem[] = [
  {
    id: 'BAT-092-A',
    name: 'BAT-092-A 电芯组件',
    category: 'labeled',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAicv0I4B3Zy4e4-_rykMgKPuwpt0_v3lzB0VBbFEjpzYKSzmfAjhT8bkjS6dD1l3AFuPQNs9UeiNx051XRBnNuOz_1t-xtmNCSaPjkjoXvUmv-MQ_saLxem9Pp96FS4BVxBmnis35lBB2UpvzLtYE_63hi1jenqnFBNg4uQW9EDXvd1_g2emOOZGWEJ4buvXu15yzKjM2YZYniAAJqt92yx5ItiTEkYQRWO7EFFFKdys-On_FomXxV7q8vvYL3MfWeNS_7hMcU2Kq5',
    confidence: 99.8,
    date: '10/24',
    time: '08:12',
    resolution: '1024x1024',
    depth: '4.2mm'
  },
  {
    id: 'PCB-441-X',
    name: 'PCB-441-X 控制电路板',
    category: 'pending',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvBAw8ruIgN-nhqRCpPRFu9uFgfvl4WMc76DPx82SCn8k4xlP0itF4YAZrBkgVlo52aSNOaGgQ4YAvtxzS5mXivVUwTmxiZQBQFYbhtv_j1Ojq4DIaUWfFzpVUspcKVwA057y4118Q3ai3AmE5ClQJvVbxL0uCyD6F7WKr9NQrQ-x5x-qnroB9v8LWnFO0JcWpz3OtIjpf_A6LbSUd1iESUunC9nBFnWzOSggIX2iAijj0zKjeTOKGGZyWxN6sQriFSSRwcrCGeCKj',
    confidence: 82.4,
    date: '10/24',
    time: '08:05',
    resolution: '1024x1024',
    depth: '1.5mm'
  },
  {
    id: 'AER-110-C',
    name: 'AER-110-C 航空涡轮叶片',
    category: 'labeled',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVtXQQqLhT3ZXGr_IJavSpNBkIXM8exG6xv7RBH5Ko3a8vyfSoIwGrtQ2FBgtLPTRPjrKfHtWuMDycNrbfr77_jFlC15W4MTd-PO3_ZLscjx305w9-wszpLpb_GsdsZT5Fwp1rgIqbHwgYRzjCf90GIqqeIFfPg6C1wNIf6fwFATPMOMcAjoORhulR3Zwey0CRZ07NfkV_DHGmXzkkq9nlLmiK2awaucXLhZZaLyJumW9cWp_5XXY0IkxnS2-NpUVtQtMIjfeMwfgc',
    confidence: 98.1,
    date: '10/24',
    time: '07:45',
    resolution: '2048x2048',
    depth: '8.4mm'
  },
  {
    id: 'WAFER-002',
    name: 'WAFER-002 高纯硅片晶圆',
    category: 'labeled',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwnjOGth_01SwpBGoxdbzb-8NSs4PE4Xb2mIOXfIkXGogNw6IhGTNn4e9P9_cb3AoB6GOXnkwV031V1dCrzS4nB8PNm3JgQ4U9ILtLbjB8Z8JtvziH3J-MRaiE1rLiNx9bu_gmujsNx2I2jHFDWyc4XK35oHKK4-8FAzJ4nTv60cjmfTrnRB18tgWs-F89Ld78796j_SAGhKfWvBCP7a9ackLn5_IziTKg_9M-QmP9ZehvCMOmRkhkz6b4kde3hGcr6JRip_rC6Hab',
    confidence: 99.9,
    date: '10/24',
    time: '07:30',
    resolution: '1024x1024',
    depth: '0.8mm'
  },
  {
    id: 'CAST-502-K',
    name: 'CAST-502-K 压铸连杆轴承',
    category: 'anomaly',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgBeN9UdSDvYX7gSSg6nYvbWaltz7o7PfNXdlMl0BWb4Su-SfzW0xTBXXlRTm-xLBYUfbKy7nEEnfCki3A8GZoh6xfOg-XwZpWZwJGyseae9TNG8D0V5ueDWIAuhzK4zJM-m1SfGcWMeWxh9r7TQUadql970TeMkQcsKPqYcs4lmX4-n4tESTxy3DmENRQFgoCaHchZdH1fzPT7x6NxRaMFrNs2HV-hsXeCczbiIYTG68vxvdXDkuWAk7OQ4_wR3Xa2-A4nTUSuY6D',
    confidence: 99.1,
    date: '10/23',
    time: '21:10',
    defectType: '气孔 (Porosity)',
    resolution: '1024x1024',
    depth: '4.2mm'
  },
  {
    id: 'ENG-TURB-01',
    name: 'ENG-TURB-01 航空涡轴压气机',
    category: 'anomaly',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5Yji8QOiR7EVpls8SdixMje5NQ5iC6oapB8F8UOPed-TwJ2g0yUB4Y6xO0jDf2Fal47F23_71OMAgeIrnIL2HlhIXJB4QxPRwx-wdHK8pArA48DhRBg_k1RK7lCtBNF3xZbhga7vGO_u6ohnBU1xNWSbPDCf-vGW3KIoD-ySYYYWEYaB0UCVkrNIl7sB2nRu6a27uS1blepGys1Dy_CyRWJcFlye4tfxAQ9aOho_0yBH3DSSbLNxD-lbJQgEUsmqqdIum_98HL-aM',
    confidence: 98.4,
    date: '10/23',
    time: '18:15',
    defectType: '夹杂 (Inclusion)',
    resolution: '2048x2048',
    depth: '12.8mm'
  }
];

export const INITIAL_LOGS: LiveDetectLog[] = [
  { timestamp: '10:42:05.120', partId: 'PART-8902-A', result: 'fail', defectType: '气孔 (Porosity)', confidence: 99.1 },
  { timestamp: '10:42:04.850', partId: 'PART-8901-A', result: 'pass' },
  { timestamp: '10:42:04.580', partId: 'PART-8900-A', result: 'pass' },
  { timestamp: '10:42:04.310', partId: 'PART-8899-A', result: 'pass' },
  { timestamp: '10:42:03.950', partId: 'PART-8898-B', result: 'pass' },
  { timestamp: '10:42:03.110', partId: 'PART-8897-A', result: 'fail', defectType: '裂纹 (Crack)', confidence: 98.2 }
];

export const TRAINING_VERSIONS: TrainingVersion[] = [
  { id: 'v2.4-rc1', name: 'v2.4-rc1 (Active)', isActive: true, date: '2024-05-20', epochs: 142, map: 94.8, status: 'Production' },
  { id: 'v2.3-final', name: 'v2.3-final', isActive: false, date: '2024-05-10', epochs: 200, map: 92.1, status: 'Archived' },
  { id: 'v2.2-baseline', name: 'v2.2-baseline', isActive: false, date: '2024-04-15', epochs: 150, map: 89.5, status: 'Archived' },
  { id: 'v2.5-dev', name: 'v2.5-alpha (Iterative)', isActive: false, date: '2024-06-01', epochs: 80, map: 95.3, status: 'Development' }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'RPT-2024-09A',
    batchId: 'B-8821',
    name: '主板电路焊接点检测报告',
    status: 'anomaly',
    time: '2024-10-24 14:30',
    duration: '45s',
    conclusion: '在对批次 B-8821 的 150 件样品进行 100% X-ray 穿透扫描后，AI 视觉引擎识别到 3 处致命缺陷。主要集中在区域 C4 的 BGA 芯片底部，存在明显的连锡（短路）现象。整体良率 98.0%，低于设定阈值 99.5%。',
    defectImages: [
      {
        title: '图 1: BGA 芯片底部 C4 区域连锡',
        description: '在控制电路板的 BGA 封装组装中，焊盘间距极小。X射线穿透显示 C4 区域相邻两颗焊球完全焊死在一起，形成高电流桥接，将导致上电后系统直接短路或烧毁。',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_uZWjxu-0TN0CIMRz_BN3KtRPMr8wEEV-AQeTtTWGyiQjKIgkcsBFQIe-Jd2oLlRJESPxEfx-FjWrV9y8VU0Ea3xknO4P1DeQJb80LwKzNbQ41d4ApedqtM9AiCFVzQWIJHfmvjUJ5L6jl40QxlXALCbhWUI3wnE359ZazUzd2HxVOFYeORx9LSgRQS1OsMvXFVSPxLwMEl61LuMN3YwEng4y4bEZpOnT-eqKlqfmnqJ6Og_aqm28ZB70qGGO0aDgfUGt0v_uBiPF',
        defectCode: 'CH-01: 短路',
        coords: { top: '25%', left: '33%', width: '16%', height: '16%' }
      },
      {
        title: '图 2: R12 电阻焊盘内部空洞超标 (>25%)',
        description: '贴片电阻 R12 背面金属焊肉中含有多个微流气泡，聚集于右侧接引脚侧，在热膨胀拉力下容易发生虚焊断路。检测到的最大单一气泡截面积占比已达 28.5%，超出安全上限。',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh1SXQr0ePjrw-O9Ir_jR7RA1jVy_eXwSVFVSzETi8TrxDcGMXHRsbORIe8hrFviaDt5G7wNPyuRjhDt1fR0-bGXlShT7-f_vJ8yy5FE0_y_HpzxjyNolr_m3wSD8FRXIoK3Gm0See9dF-9qMz_Eqxtx0EbwCObZas1N36EjkYu401v7JppX669zP-Ifd4GIhQUqe9Y94A0u9AHch0MUxldSuq3-70GMSsOcxSEHJEzilQcXJtCzesKHfUaU0IMWafdBmAKEXnj4ei',
        defectCode: 'CH-02: 空洞超标',
        coords: { top: '50%', left: '66%', width: '10%', height: '10%' }
      }
    ],
    recommendations: [
      '立即隔离批次 B-8821 的所有剩余库存，阻止流入下一道组装工序。',
      '检查回流焊炉温曲线，特别是 C4 区域对应的温区，可能存在温度偏低导致焊锡未完全融化分离。',
      '对锡膏印刷机的钢网张力及清洗记录进行核查，排除锡膏量过多引起的连锡。',
      '微调 BGA 贴装贴片头压力，并针对 R12 焊位重新校对吸嘴水平度。'
    ]
  },
  {
    id: 'RPT-2024-09B',
    batchId: 'C-1024',
    name: '外壳表面划痕抽检报告',
    status: 'normal',
    time: '2024-10-24 10:15',
    duration: '32s',
    conclusion: '在对批次 C-1024 的 50 件高压铸铝壳体进行表面三色可见光源及轻量 X-ray 分析后，未发现结构裂隙或严重表面划伤，全部零件指标正常，综合良率 100%。',
    defectImages: [],
    recommendations: [
      '继续维持现有的表面精抛光工艺及参数。',
      '对自动拆垛机器人的气动夹爪橡胶保护垫进行例行磨损度抽查，防止硬磨损产生意外压痕。'
    ]
  },
  {
    id: 'RPT-2024-08X',
    batchId: 'A-0092',
    name: '电池组装配线全检检查单',
    status: 'normal',
    time: '2024-10-23 16:45',
    duration: '112s',
    conclusion: '对批次 A-0092 极耳超声波点焊效果进行的 X-ray 厚度一致性微米级穿透测试，结果表明熔核直径及过载深度均在设计范围中，极极极片无分层扭曲。',
    defectImages: [],
    recommendations: [
      '声极振头已经累积运行 1.25M 次循环，建议在接下来的 50k 循环内视情况做常规换刃研磨。'
    ]
  },
  {
    id: 'RPT-2024-08Y',
    batchId: 'D-4410',
    name: '散热模组尺寸测量偏差报告',
    status: 'anomaly',
    time: '2024-10-23 09:20',
    duration: '28s',
    conclusion: '检测到散热模组 D-4410 固定脚厚度有大约 0.35mm 的超差波动，主要由于磨具切削刃面异常导致边缘毛刺过重。判定不合格，拦截该批次产品。',
    defectImages: [
      {
        title: '图 1: 散热鳍片根部气孔缺陷',
        description: '由于散热器高压脱模剂不均匀，根部产生了多个尺寸在0.6mm-1.1mm之间的缩孔，大大降低了热导系数与震动刚性阻尼。',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgBeN9UdSDvYX7gSSg6nYvbWaltz7o7PfNXdlMl0BWb4Su-SfzW0xTBXXlRTm-xLBYUfbKy7nEEnfCki3A8GZoh6xfOg-XwZpWZwJGyseae9TNG8D0V5ueDWIAuhzK4zJM-m1SfGcWMeWxh9r7TQUadql970TeMkQcsKPqYcs4lmX4-n4tESTxy3DmENRQFgoCaHchZdH1fzPT7x6NxRaMFrNs2HV-hsXeCczbiIYTG68vxvdXDkuWAk7OQ4_wR3Xa2-A4nTUSuY6D',
        defectCode: 'CH-03: 连接根部缩孔',
        coords: { top: '35%', left: '42%', width: '12%', height: '8%' }
      }
    ],
    recommendations: [
      '对压铸模具进行紧急表面抛光退火修复。',
      '改善模底流出通路的溢油孔通畅度，减少模坑气塞占比。'
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '检测不达标警告：工件 CAST-502-K 气孔严重超标',
    subtitle: '1号流水线自主感知并强制拦截。点击进行实时缺陷渲染框选。',
    time: '2分钟前',
    type: 'anomaly',
    targetTab: 'vision',
    read: false
  },
  {
    id: 'notif-2',
    title: '主板电路焊接点专业诊断报告已就绪 (RPT-2024-09A)',
    subtitle: 'BGA 芯片引脚多点断连，已自动生成冶金工艺调优预案。',
    time: '24分钟前',
    type: 'report',
    targetTab: 'reports',
    read: false
  },
  {
    id: 'notif-3',
    title: '检测不达标异常：工件 ENG-TURB-01 内部发现夹杂物',
    subtitle: '2号流水线高灵敏穿刺复检未通过，点击进入视觉引擎对齐分析。',
    time: '1小时前',
    type: 'anomaly',
    targetTab: 'vision',
    read: false
  },
  {
    id: 'notif-4',
    title: '散热模组尺寸偏差专业诊断报告已就绪 (RPT-2024-08Y)',
    subtitle: '由于模具高偏热膨胀，根部缩水空孔多发，已拦截。',
    time: '2小时前',
    type: 'report',
    targetTab: 'reports',
    read: false
  }
];


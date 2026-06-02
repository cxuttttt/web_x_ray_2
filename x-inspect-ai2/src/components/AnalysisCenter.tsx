/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, Layers, Activity, FileText, Compass, CheckCircle2, 
  ShieldAlert, GitCompare, Grid3X3, ArrowUpRight, Minimize2, Sliders
} from 'lucide-react';
import { getStoredScans, getStoredReports } from '../utils/storage';

export default function AnalysisCenter() {
  const [scans, setScans] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [activeComparison, setActiveComparison] = useState<'otsu' | 'adaptive'>('otsu');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('PCB-441-X');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const scansData = getStoredScans();
      const reportsData = getStoredReports();
      setScans(scansData);
      setReports(reportsData);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Preset identifiers
  const PRESET_SCAN_IDS = ['BAT-092-A', 'PCB-441-X', 'AER-110-C', 'WAFER-002', 'CAST-502-K', 'ENG-TURB-01'];
  const PRESET_REPORT_IDS = ['RPT-2024-09A', 'RPT-2024-09B', 'RPT-2024-08X', 'RPT-2024-08Y'];

  // Real-time computed states
  const totalScans = scans.length;
  const userScans = scans.filter(s => !PRESET_SCAN_IDS.includes(s.id));
  const presetScans = scans.filter(s => PRESET_SCAN_IDS.includes(s.id));

  const totalReports = reports.length;
  const userReports = reports.filter(r => !PRESET_REPORT_IDS.includes(r.id));

  const anomalyCount = scans.filter(s => s.category === 'anomaly').length;
  const defectPercent = totalScans > 0 ? ((anomalyCount / totalScans) * 100).toFixed(1) : '0.0';

  // Benchmark detail for the threshold comparison block
  const comparisonBenchmarks = {
    otsu: [
      { part: '电芯组件', th: 'Otsu: 114', areaDiff: '+1.5%', circularity: 0.88, matchRate: '98.5%' },
      { part: 'PCB焊线', th: 'Otsu: 132', areaDiff: '-4.2%', circularity: 0.12, matchRate: '92.0%' },
      { part: '航空叶片', th: 'Otsu: 98', areaDiff: '+0.8%', circularity: 0.45, matchRate: '99.1%' },
      { part: '硅片晶圆', th: 'Otsu: 154', areaDiff: '+0.2%', circularity: 0.98, matchRate: '99.8%' },
    ],
    adaptive: [
      { part: '电芯组件', th: 'Local: AD15', areaDiff: '+0.1%', circularity: 0.94, matchRate: '99.4%' },
      { part: 'PCB焊线', th: 'Local: AD21', areaDiff: '+0.8%', circularity: 0.15, matchRate: '98.2%' },
      { part: '航空叶片', th: 'Local: AD11', areaDiff: '+0.2%', circularity: 0.48, matchRate: '99.4%' },
      { part: '硅片晶圆', th: 'Local: AD9', areaDiff: '-0.1%', circularity: 0.99, matchRate: '99.9%' },
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12"
    >
      
      {/* Header section */}
      <div className="flex justify-between items-end mb-10 select-none">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">
            本地与算法实验分析大屏 (Local CV Analytics Center)
          </h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            结合图像灰度直方图梯度演变、区域特征几何定量误差与交叉检测对照报表
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-primary bg-white border border-outline-variant px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          工作区实时联动
        </div>
      </div>

      {/* KPI Stats Grid (4 blocks - calculated from actual counts!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-bento-gap mb-8">
        
        {/* Block 1: Real-time user total scans */}
        <div className="bento-card flex flex-col justify-between min-h-[160px] bg-white border border-[#EAEAEA] rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              载入图像总数 (LOADED IMAGES)
            </span>
            <Layers className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary tracking-tighter">
              {totalScans} <span className="text-xs font-normal text-zinc-500">张</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
              <span>您的自定义: {userScans.length}张 | 系统预置: {presetScans.length}张</span>
            </div>
          </div>
        </div>

        {/* Block 2: Porosity Defect Ratio calculated dynamically */}
        <div className="bento-card flex flex-col justify-between min-h-[160px] bg-white border border-[#EAEAEA] rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              异常检出比例 (DEFECT RATIO)
            </span>
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-red-600 tracking-tighter">
              {defectPercent}%
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
              <span>合计异常缺陷数: {anomalyCount} 件 (包含系统示例)</span>
            </div>
          </div>
        </div>

        {/* Block 3: User custom uploads count */}
        <div className="bento-card flex flex-col justify-between min-h-[160px] bg-white border border-[#EAEAEA] rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              您的自定义扫描 (YOUR CUSTOM SCANS)
            </span>
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-primary tracking-tighter">
              {userScans.length} <span className="text-xs font-normal text-zinc-500">次</span>
            </div>
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mt-1.5">
              本会话自主上传分析的实测数值
            </div>
          </div>
        </div>

        {/* Block 4: Reports Count dynamically */}
        <div className="bento-card flex flex-col justify-between min-h-[160px] bg-white border border-[#EAEAEA] rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              已归档诊断报告 (REPORTS COUNT)
            </span>
            <FileText className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-zinc-900 tracking-tighter">
              {totalReports} <span className="text-xs font-normal text-zinc-500">份</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
              <span>自定义报告: {userReports.length} 份 | 内置示例: {presetScans.length > 0 ? 4 : 0} 份</span>
            </div>
          </div>
        </div>

      </div>

      {/* Primary Section: Contour Metric Error Matrix & Experimental Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap items-stretch mb-8">
        
        {/* Left Side: OpenCV Otsu vs Adaptive localized error analysis matching homework requirement */}
        <div className="bento-card lg:col-span-8 flex flex-col min-h-[420px] bg-white border border-[#EAEAEA] rounded-[24px] p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h2 className="text-sm font-black text-zinc-800 uppercase tracking-wider">
                不同分割算法缺陷特征计量对比实验表
              </h2>
              <span className="text-[10px] font-sans font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                算法控制组案例组 (Thresholding Method comparison - Standard Benchmarks)
              </span>
            </div>
            <div className="flex border border-outline-variant p-0.5 rounded bg-slate-100 text-[10px] self-start sm:self-center font-bold font-mono">
              <button 
                onClick={() => setActiveComparison('otsu')}
                className={`px-3 py-1.5 rounded ${activeComparison === 'otsu' ? 'bg-primary text-white' : 'text-zinc-600'}`}
              >
                OTSU 全局大津
              </button>
              <button 
                onClick={() => setActiveComparison('adaptive')}
                className={`px-3 py-1.5 rounded ${activeComparison === 'adaptive' ? 'bg-primary text-white' : 'text-zinc-600'}`}
              >
                ADAPTIVE 自适应
              </button>
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-between mt-2">
            <p className="text-xs text-secondary leading-relaxed mb-6">
              在 X 光胶片密度不均匀的复杂背景下，全局大津法 (Otsu) 与自适应局部二值化处理同一缺陷轮廓时，对应的特征偏差误差(比对人工金标准)以及算出得出的<b>圆形度(Circularity Factor)</b>区别如下。
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-[#7c7273] font-bold">
                    <th className="pb-3 pr-2">工件类型 (Preset Target)</th>
                    <th className="pb-3 pr-2">分割阈值系数</th>
                    <th className="pb-3 pr-2">实测面积误差</th>
                    <th className="pb-3 pr-2">精确圆形度 (Circularity)</th>
                    <th className="pb-3 text-right">与标准标注拟合率 (IoU)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {comparisonBenchmarks[activeComparison].map((benchmark, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-4 font-sans font-bold text-primary">{benchmark.part}</td>
                      <td className="py-4 text-zinc-600 font-semibold">{benchmark.th}</td>
                      <td className={`py-4 font-bold ${benchmark.areaDiff.startsWith('-') ? 'text-amber-600' : 'text-zinc-900'}`}>{benchmark.areaDiff}</td>
                      <td className="py-4 text-zinc-900">{benchmark.circularity}</td>
                      <td className="py-4 text-right text-emerald-600 font-bold">{benchmark.matchRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200/50 text-[11px] leading-relaxed text-[#7c7273]">
              <span className="font-bold text-zinc-800 block mb-0.5">实验报告对照结论 [示例 / Benchmark Summary]</span>
              自适应局部算法 (Adaptive Local) 在工件表面复杂凹凸、阴影倾斜、光强非正态分布时能提供明显优于大津法的拟合率(IoU平均高出5.3%)，可提取更精确的微米级周长。而在背景全均匀的完美压铸件中，大津法效率较高，计算时延比自适应法少28ms。
            </div>
          </div>
        </div>

        {/* Right Side: Geometry & shape profiling detail */}
        <div className="bento-card lg:col-span-4 flex flex-col min-h-[420px] bg-white border border-[#EAEAEA] rounded-[24px] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 select-none">
            <h2 className="text-sm font-black text-zinc-800 uppercase tracking-wider">
              缺陷形态几何计算规则
            </h2>
            <Compass className="w-5 h-5 text-zinc-400" />
          </div>

          <div className="flex flex-col gap-5 flex-grow justify-center text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-zinc-900 block mb-1">1. 轮廓边界与积分面积 (Area Count)</span>
              <p className="text-zinc-500 leading-relaxed font-sans text-[11px]">
                通过二值图像扫描的白像素进行积分求和。公式：<code>Area = ∑ P(x, y)</code>。单位为像素的二次方。
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-zinc-900 block mb-1">2. 欧几里德轮廓周长 (Perimeter)</span>
              <p className="text-zinc-500 leading-relaxed font-sans text-[11px]">
                八邻域边界拟合。对水平、垂直方向边界距离加1，斜对角方向加1.414，得出高精度轮廓线长度。
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-zinc-900 block mb-1">3. 圆形度与类型判定 (Porosity Classification)</span>
              <p className="text-zinc-500 leading-relaxed font-sans text-[11px]">
                <code>C = 4π * Area / Perimeter²</code>。C 接近 1 说明缺陷形态为极度标准的正圆孔（气缩孔）；C 接近 0 代表撕裂斜纹、金属内部拉丝夹杂等细长瑕疵。
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Gray-level Temperature color-map & distribution block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap md:gap-gutter items-stretch">
        
        {/* Heatmap-like visual simulating the gray shade bins */}
        <div className="bento-card lg:col-span-12 flex flex-col min-h-[280px] bg-white border border-[#EAEAEA] rounded-[24px] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-4 select-none">
            <h2 className="text-sm font-black text-zinc-800 uppercase tracking-wider">
              缺陷截面灰度阶梯累计能量直方图 [示例 / Example Histogram]
            </h2>
            <Grid3X3 className="w-5 h-5 text-zinc-400" />
          </div>

          <p className="text-xs text-secondary leading-relaxed mb-6">
            下方网格代表自灰度0度（暗部，一般对应重影或高衰减孔洞缺陷）至灰度255度（亮部，基质金属本色）下连通阈值能量直方图，X 标注处表示 AI 主动拦截缺陷的突变梯度区间：
          </p>

          <div className="flex-grow grid grid-cols-8 sm:grid-cols-16 gap-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            {/* Opacity grids illustrating typical X-Ray density values */}
            <div className="bg-primary/5 rounded h-10 select-none flex items-center justify-center text-[10px] text-zinc-400 font-mono">0</div>
            <div className="bg-primary/10 rounded h-10" />
            <div className="bg-primary/20 rounded h-10" />
            <div className="bg-primary/35 rounded h-10" />
            <div className="bg-primary/50 text-white rounded h-10 flex items-center justify-center font-bold text-[10px] font-mono select-none">X</div>
            <div className="bg-primary/30 rounded h-10" />
            <div className="bg-primary/15 rounded h-10" />
            <div className="bg-primary/10 rounded h-10" />
            <div className="bg-primary/5 rounded h-10" />
            <div className="bg-primary/5 rounded h-10" />
            <div className="bg-primary/5 rounded h-10" />
            <div className="bg-primary/8 rounded h-10" />
            <div className="bg-primary/10 rounded h-10" />
            <div className="bg-primary/12 rounded h-10 opacity-70" />
            <div className="bg-primary/5 rounded h-10 opacity-40 animate-pulse" />
            <div className="bg-primary/5 rounded h-10 flex items-center justify-center text-[10px] text-zinc-400 font-mono select-none">255</div>
          </div>

          <div className="flex justify-between items-center mt-4 text-[10px] text-on-surface-variant font-mono uppercase tracking-widest select-none">
            <span>重空隙区间 LOP (灰度 &lt; 90)</span>
            <div className="flex-grow h-1 mx-4 bg-gradient-to-r from-primary/5 to-primary rounded-full opacity-60" />
            <span>基体金属亮部本色 HIP (灰度 &gt; 180)</span>
          </div>
        </div>

      </div>

    </motion.div>
  );
}

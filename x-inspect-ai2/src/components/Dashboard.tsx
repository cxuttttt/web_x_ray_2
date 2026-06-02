/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab } from '../types';
import { motion } from 'motion/react';
import { PlayCircle, FileCode, CheckCircle2, ShieldAlert, Sparkles, HelpCircle, Activity, BarChart4 } from 'lucide-react';
import { getStoredScans, getStoredReports } from '../utils/storage';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scans, setScans] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      const scansData = getStoredScans();
      const reportsData = getStoredReports();
      setScans(scansData);
      setReports(reportsData);
    } catch (err) {
      console.error('Error dashboard sync:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 35; // Max sub-10 deg tilt
    const y = (e.clientY - top - height / 2) / 35;
    setRotateX(-y);
    setRotateY(x);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Preset constants to identify examples vs real custom operations
  const PRESET_SCAN_IDS = ['BAT-092-A', 'PCB-441-X', 'AER-110-C', 'WAFER-002', 'CAST-502-K', 'ENG-TURB-01'];
  const PRESET_REPORT_IDS = ['RPT-2024-09A', 'RPT-2024-09B', 'RPT-2024-08X', 'RPT-2024-08Y'];

  // Categorize scans
  const userScans = scans.filter(s => !PRESET_SCAN_IDS.includes(s.id));
  const userDefectiveCount = userScans.filter(s => s.category === 'anomaly').length;
  const userHealthyCount = userScans.filter(s => s.category === 'labeled').length;

  const presetScansCount = scans.filter(s => PRESET_SCAN_IDS.includes(s.id)).length;
  const presetDefectiveCount = scans.filter(s => PRESET_SCAN_IDS.includes(s.id) && s.category === 'anomaly').length;

  // Categorize reports
  const userReportsCount = reports.filter(r => !PRESET_REPORT_IDS.includes(r.id)).length;
  const presetReportsCount = reports.filter(r => PRESET_REPORT_IDS.includes(r.id)).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12"
    >
      
      {/* Hero Section */}
      <section className="mb-14 text-left max-w-4xl select-none">
        <h1 className="flex flex-col gap-2.5 tracking-tight mb-6">
          <span className="text-xs md:text-sm font-black text-secondary uppercase tracking-[0.2em] font-mono">
            工业 X 光检测智能系统 (X-Ray Terminal)
          </span>
          <span className="text-4xl md:text-5xl lg:text-6xl font-black text-primary leading-tight uppercase">
            缺陷检测智能平台
          </span>
        </h1>
        <p className="text-body-lg text-secondary mb-10 max-w-2xl leading-relaxed">
          整合传统计算机视觉 (OpenCV 算法) 与新一代大语言视觉模型 (Gemini Vision) 的精密缺陷标注与分析终端。为现代航空、精密电路与高压铸造提供高精度、可视化的无损检测方案。
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            id="btn_start_inspect"
            onClick={() => setActiveTab('vision')}
            className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            进入视觉检测引擎
          </button>
          
          <button 
            id="btn_view_datasets"
            onClick={() => setActiveTab('datasets')}
            className="border border-outline-variant text-primary px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
          >
            <FileCode className="w-5 h-5" />
            查看数据管理中心
          </button>
        </div>
      </section>

      {/* Interactive 3D Scanner Visualization (Clearly marked as conceptual simulation) */}
      <section className="relative mb-20 cursor-pointer group">
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: 1000,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: 'transform 0.15s ease-out'
          }}
          className="relative aspect-[21/9] w-full rounded-2xl bg-black overflow-hidden border border-outline-variant shadow-lg"
        >
          {/* Scanline Animation */}
          <div className="absolute inset-0 scan-line-animation" />

          {/* Matrix Dots Background Grid */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Jet Engine Turbine X-ray background image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img 
              alt="Turbine Jet Engine Turbine X-Ray Visualiser representation" 
              className="w-full h-full object-cover opacity-85 mix-blend-lighten grayscale contrast-125 select-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5Yji8QOiR7EVpls8SdixMje5NQ5iC6oapB8F8UOPed-TwJ2g0yUB4Y6xO0jDf2Fal47F23_71OMAgeIrnIL2HlhIXJB4QxPRwx-wdHK8pArA48DhRBg_k1RK7lCtBNF3xZbhga7vGO_u6ohnBU1xNWSbPDCf-vGW3KIoD-ySYYYWEYaB0UCVkrNIl7sB2nRu6a27uS1blepGys1Dy_CyRWJcFlye4tfxAQ9aOho_0yBH3DSSbLNxD-lbJQgEUsmqqdIum_98HL-aM"
            />
          </div>

          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white" />
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white" />
          </div>

          {/* Floaters clearly indicating Simulation state */}
          <div className="absolute top-8 left-8 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/15 shadow-xl pointer-events-auto">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-error animate-ping" />
              <span className="font-bold text-[10px] uppercase text-white tracking-widest flex items-center gap-1">
                缺陷重构仪连通 (模拟)
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-400">系统状态: 待检测图像载入</p>
            <p className="text-[10px] font-mono text-zinc-400">图像源: 零件透射传感器</p>
          </div>

          <div className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/15 shadow-xl pointer-events-auto">
            <span className="font-bold text-[10px] uppercase text-zinc-100 tracking-widest block mb-1">
              视觉处理核心参数
            </span>
            <div className="h-1 w-28 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-white w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap">
        
        {/* Card 1: Session & Database Statistics */}
        <div 
          onClick={() => setActiveTab('datasets')}
          className="lg:col-span-7 border border-outline-variant rounded-2xl p-8 bg-white flex flex-col justify-between hover:bg-surface-container-low transition-all cursor-pointer group shadow-sm min-h-[380px]"
        >
          <div>
            <span className="text-label-caps font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
              工作区检测统计 (Workspace statistics)
            </span>
            <h2 className="text-headline-xl font-extrabold text-primary mb-4 leading-normal">
              实时数据总览 (Real-time Session)
            </h2>
            <p className="text-xs text-secondary leading-relaxed mb-6">
              系统根据您的真实操作及平台预置样例维护统计。当您在“视觉引擎”页上传检测您的 X 光图片，数据即会在此动态累加。
            </p>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {/* Left Column: Real Session stats */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#7c7273] uppercase tracking-wider block mb-1">
                    您的分析会话 (Your Real Scans)
                  </span>
                  <p className="text-xs text-zinc-500 mb-2 font-medium">由您主动点击分析的数据：</p>
                </div>
                <div className="space-y-1.5 font-mono text-xs mt-1 text-primary">
                  <div className="flex justify-between border-b border-white pb-1">
                    <span>已分析件数</span>
                    <span className="font-bold">{userScans.length}</span>
                  </div>
                  <div className="flex justify-between border-b border-white pb-1">
                    <span>检测缺陷件</span>
                    <span className="font-bold text-red-600">{userDefectiveCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>已生成报告</span>
                    <span className="font-bold text-zinc-900">{userReportsCount}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Preset Sandbox Database stats */}
              <div className="bg-yellow-50/40 border border-yellow-100/60 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    系统预制示例 (Preset Examples)
                  </span>
                  <p className="text-xs text-amber-700/80 mb-2 font-medium">内置的标准测试及演示件：</p>
                </div>
                <div className="space-y-1.5 font-mono text-xs mt-1 text-amber-900">
                  <div className="flex justify-between border-b border-yellow-50 pb-1">
                    <span>示例图像</span>
                    <span className="font-bold">{presetScansCount} 件</span>
                  </div>
                  <div className="flex justify-between border-b border-yellow-50 pb-1">
                    <span>示例异常件</span>
                    <span className="font-bold text-red-700">{presetDefectiveCount} 件</span>
                  </div>
                  <div className="flex justify-between">
                    <span>示例诊断报告</span>
                    <span className="font-bold">{presetReportsCount} 份</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center text-[10px] text-zinc-400 uppercase tracking-widest select-none pt-4 border-t border-slate-100">
            <span>在线状态: 边缘服务器运行中</span>
            <span className="text-primary font-bold flex items-center gap-1 group-hover:underline">
              前往管理数据
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Educational CV vs AI Algorithm principle Card */}
        <div 
          onClick={() => setActiveTab('vision')}
          className="lg:col-span-5 border border-outline-variant rounded-2xl p-8 bg-zinc-950 text-white flex flex-col justify-between hover:bg-zinc-900/95 transition-all cursor-pointer group shadow-md"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                工业零部件缺陷识别理论依据
              </span>
              <HelpCircle className="w-4 h-4 text-zinc-400" />
            </div>
            
            <h3 className="text-headline-xl font-bold text-zinc-100 mb-4 tracking-tight leading-normal">
              缺陷提取定位机制对比
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed mb-6">
              结合经典数字图像处理(CV)与多模态AI视觉框选标注，系统涵盖以下作业要点：
            </p>

            <div className="space-y-4 text-xs font-mono">
              <div className="border-l-2 border-white/20 pl-3">
                <span className="block text-[10px] font-bold text-white uppercase mb-1">大津阈值法 (Otsu Global)</span>
                <p className="text-[11px] text-zinc-400">自动迭代类间方差极值。寻找整图最核心特征分界阈值。</p>
              </div>

              <div className="border-l-2 border-white/20 pl-3">
                <span className="block text-[10px] font-bold text-white uppercase mb-1">自适应局部法 (Adaptive Local)</span>
                <p className="text-[11px] text-zinc-400">针对复杂阴影、壳体厚度分布，各分格按高斯均值计算偏移。</p>
              </div>

              <div className="border-l-2 border-white/20 pl-3">
                <span className="block text-[10px] font-bold text-white uppercase mb-1">物理轮廓与圆形度 (Circularity)</span>
                <p className="text-[11px] text-zinc-400">公式：<code>4π×(面积)/(周长²)</code>。圆孔气眼通常 &gt; 0.8，裂缝往往 &lt; 0.2。</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-8 pt-4 border-t border-zinc-800">
            <span>支持自定义图片上传</span>
            <span className="bg-white/10 text-white px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider">
              前往对比算法
            </span>
          </div>
        </div>

        {/* Card 3: Model Convergence Bar Chart clearly marked as Example */}
        <div 
          onClick={() => setActiveTab('training')}
          className="lg:col-span-12 border border-outline-variant rounded-2xl p-8 bg-white flex flex-col hover:bg-surface-container-low transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-primary flex items-center gap-2">
                核心神经网络缺陷检出精确度 (mAP)
                <span className="text-[10px] font-sans font-medium bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full select-none leading-none">
                  系统预制示例 (Dataset Benchmark Example)
                </span>
              </h3>
              <p className="text-xs text-secondary mt-1">
                最新三个主要迭代训练周期 (Baseline v1, Release v2, Test v3) 下不同材质零部件的实际收敛检测精确度(%)
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-semibold text-secondary self-start sm:self-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-black rounded-sm" /> 强化分割大模型精度
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-white border border-outline rounded-sm" /> 传统像素分割效果
              </div>
            </div>
          </div>
          
          <div className="relative bg-slate-50 rounded-xl border border-slate-100 p-6 flex flex-col justify-end min-h-[220px]">
            {/* Axis grid lines */}
            <div className="absolute inset-x-6 top-6 bottom-14 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-slate-200 w-full text-[9px] font-mono text-zinc-400 text-right pr-2">100%</div>
              <div className="border-b border-dashed border-slate-200 w-full text-[9px] font-mono text-zinc-400 text-right pr-2">75%</div>
              <div className="border-b border-dashed border-slate-200 w-full text-[9px] font-mono text-zinc-400 text-right pr-2">50%</div>
              <div className="border-b border-dashed border-slate-200 w-full text-[9px] font-mono text-zinc-400 text-right pr-2">25%</div>
            </div>

            {/* Custom SVG/Flex Bar representation */}
            <div className="flex-grow flex items-end justify-between px-10 pt-4 z-10">
              {[
                { label: 'BAT 电芯部件', cv: 42, ai: 95 },
                { label: 'PCB 焊接引脚', cv: 78, ai: 92 },
                { label: 'AER 涡轮叶片', cv: 34, ai: 98 },
                { label: 'WAFER 高纯硅片', cv: 88, ai: 99 },
                { label: 'CAST 连杆孔隙', cv: 50, ai: 94 },
                { label: 'ENG 压气外壳', cv: 68, ai: 91 }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end max-w-[110px] group/item">
                  <div className="flex items-end gap-2.5 h-3/4 justify-center w-full">
                    {/* CV Bar */}
                    <div 
                      style={{ height: `${item.cv}%` }} 
                      className="w-3.5 bg-white border border-slate-400 rounded-t-sm transition-all duration-300 group-hover/item:border-primary relative"
                      title={`传统CV定位: ${item.cv}%`}
                    >
                      <span className="hidden group-hover/item:block absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold bg-white px-1 border rounded shadow z-50">{item.cv}%</span>
                    </div>
                    {/* AI Bar */}
                    <div 
                      style={{ height: `${item.ai}%` }} 
                      className="w-3.5 bg-zinc-950 rounded-t-sm transition-all duration-500 group-hover/item:bg-primary relative"
                      title={`AI视觉框选: ${item.ai}%`}
                    >
                      <span className="hidden group-hover/item:block absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold bg-black text-white px-1 rounded shadow z-50">{item.ai}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-sans font-bold text-on-surface-variant block mt-3 select-none leading-none">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      { styleTags }

    </motion.div>
  );
}

const styleTags = (
  <style>{`
    @keyframes scan {
      0% { top: 0; opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { top: 100%; opacity: 0; }
    }
    .scan-line-animation {
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(to right, transparent, #FFFFFF, transparent);
      animation: scan 4s linear infinite;
      z-index: 5;
      pointer-events: none;
    }
    .rounded-bento {
      border-radius: 20px;
    }
  `}</style>
);

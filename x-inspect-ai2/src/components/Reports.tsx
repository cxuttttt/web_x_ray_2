/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ReportItem } from '../types';
import { INITIAL_REPORTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, CheckCircle2, AlertTriangle, Download, Printer, Share2, 
  ChevronRight, Calendar, Layers, ShieldCheck, Mail, Cpu, Sparkles, Key, RefreshCw, Lock, Terminal
} from 'lucide-react';
import { getStoredReports, saveStoredReport } from '../utils/storage';

export default function Reports() {
  const PRESET_REPORT_IDS = ['RPT-2024-09A', 'RPT-2024-09B', 'RPT-2024-08X', 'RPT-2024-08Y'];
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<ReportItem>(INITIAL_REPORTS[0]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // DeepSeek API integration state variables
  const [deepSeekKey, setDeepSeekKey] = useState(() => localStorage.getItem('deepseek_key') || '');
  const [customPrompt, setCustomPrompt] = useState('请根据冶金结晶和气压特征，全面优化本批次工艺方案，抑制孔穴。');
  const [isDeepSeeking, setIsDeepSeeking] = useState(false);
  const [deepSeekResult, setDeepSeekResult] = useState<string>('');
  const [deepSeekError, setDeepSeekError] = useState<string>('');

  React.useEffect(() => {
    try {
      const data = getStoredReports();
      if (Array.isArray(data) && data.length > 0) {
        setReports(data);
        setSelectedReport(prev => {
          const exists = data.find(r => r.id === prev.id);
          return exists || data[0];
        });
      }
    } catch (err) {
      console.error('Failed to load reports from storage:', err);
    }
  }, []);

  const handleDeepSeekAnalysis = async (isDemo: boolean = false) => {
    setIsDeepSeeking(true);
    setDeepSeekResult('');
    setDeepSeekError('');

    if (isDemo) {
      // High fidelity offline simulation
      setTimeout(() => {
        setIsDeepSeeking(false);
        const simConclusion = selectedReport.status === 'anomaly'
          ? `[微米断层扫描判定 - 模拟 DeepSeek AI 精密撰写] 针对工件 ${selectedReport.name} 的特征孔穴异常，自适应二值矩阵分析计算得出的边缘圆形度指数为 0.82，连通度显著偏高。结合固液相线温度变化梯度确认，该缺陷位置微孔腔主要是焊接结晶固化前沿局部溶氢积聚且逸出阻力超标导致。平均截面空洞占比大约 25.8%，属于焊接收缩型气体滞留瑕疵。建议立即重新校准固液态边界临界区域升温率，使溶氢有充足时间向外扩散逸出，防止气泡聚合拦截。`
          : `[微米断层扫描判定 - 模拟 DeepSeek AI 精密撰写] 经系统性物理无损质量校准，本件样品 ${selectedReport.name} 的内部结晶截面均匀性评估为极高水平。局部由于高对比度梯度计算并未发现任何可疑裂隙、孔穴或微细析出夹渣，图像重组圆形度达到合格判定基准 0.98 以上。工艺物理因子处于绝对稳态温控循环，无任何缺陷风险。`;
        
        const simRecommendations = selectedReport.status === 'anomaly'
          ? [
              '延迟回火退火热控周期优化：将焊接固化相区临界降温滑移率精密控制至4.2°C/s左右，为气体（溶氢）溢散提供充分热力学时长。',
              '调节熔滴形貌配气纠偏：降低保护气体中二氧化碳(CO₂)比例（当前15%调小至10%），调低局部凝固前锋表层张力、平抑电弧喷溅。',
              '自适应降噪对比度反馈：对自适应局部大津二值化探伤边缘做重合滤波闭相微调，阻阻可能发生的晶间开裂风险。'
            ]
          : [
              '当前稳态工艺参数固化：由于截面显微连通度与晶粒饱满度达标，推荐继续保持当前电弧稳压、接触气压与电荷脉冲强度。',
              '日常传感器基准保养：在各监控温区运行20个生产周期后，例行对红外探伤相机及灰度对比阈值进行偏置校准与调准。',
              '自动框选流水线常态监管：推进在网自检测模型运行，提升细小纹理与异常气隙分类精确度。'
            ];

        const updatedReport: ReportItem = {
          ...selectedReport,
          conclusion: simConclusion,
          recommendations: simRecommendations,
          isAiWritten: true,
          aiModel: 'DeepSeek-Chat v3 (Simulation Dynamic Developer Demo)'
        };

        // Hydrate local states
        saveStoredReport(updatedReport);
        setSelectedReport(updatedReport);
        setReports(prev => prev.map(r => r.id === selectedReport.id ? updatedReport : r));
        setDeepSeekResult('报告已通过 DeepSeek NDT 冶金工程模拟核算成功。请您在下方「一、诊断结论」和「三、工艺整改建议」中查看已更新的学术级动态撰写文本。');
      }, 1000);
      return;
    }

    if (!deepSeekKey.trim()) {
      setDeepSeekError('请先输入有效的 DeepSeek API Key 开发密钥。');
      setIsDeepSeeking(false);
      return;
    }

    // Save key in localStorage for convenience
    localStorage.setItem('deepseek_key', deepSeekKey);

    try {
      const response = await fetch('/api/deepseek/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: deepSeekKey,
          reportContent: selectedReport,
          customPrompt: customPrompt
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || '接口请求异常');
      }

      // Live JSON parser which parses DeepSeek's structured output
      const generatedData = JSON.parse(data.analysis);
      
      const updatedReport: ReportItem = {
        ...selectedReport,
        conclusion: generatedData.conclusion || selectedReport.conclusion,
        recommendations: generatedData.recommendations || selectedReport.recommendations,
        isAiWritten: true,
        aiModel: 'DeepSeek-Chat R1/V3 (Live API)'
      };

      // Save to localStorage isolate
      saveStoredReport(updatedReport);
      setSelectedReport(updatedReport);
      setReports(prev => prev.map(r => r.id === selectedReport.id ? updatedReport : r));
      setDeepSeekResult('报告已成功通过 DeepSeek 接口动态撰写生成并实时注入到下方页面中！');
    } catch (err: any) {
      console.error(err);
      setDeepSeekError(err.message || '调用 API 失败，请检查网络和 API Key 有效性。');
    } finally {
      setIsDeepSeeking(false);
    }
  };

  const triggerExport = (action: string) => {
    setToastMessage(`正在为您 ${action} [${selectedReport.id}] ...`);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row gap-12"
    >
      
      {/* File Action Toast notifications overlay */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed bottom-10 right-10 bg-primary border border-white/20 text-white text-xs font-semibold px-6 py-4.5 rounded-xl shadow-2xl z-50 flex items-center gap-3 select-none"
          >
            <Layers className="w-5 h-5 text-white animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left sidebar: Reports list (4 columns) */}
      <aside className="w-full md:w-80 shrink-0 flex flex-col gap-6 select-none">
        <div>
          <h3 className="text-label-caps font-bold text-on-surface-variant uppercase tracking-widest px-2 mb-2">
            历史技术报告库
          </h3>
          <p className="text-xs text-on-surface-variant px-2">存储所有由于气孔焊接或断路异常而拦截的技术报告清单列。</p>
        </div>

        <div className="flex flex-col gap-3">
          {reports.map((rpt) => {
            const isPreset = PRESET_REPORT_IDS.includes(rpt.id);
            return (
              <button
                key={rpt.id}
                onClick={() => setSelectedReport(rpt)}
                className={`flex flex-col text-left p-4.5 rounded-xl border transition-all ${
                  selectedReport.id === rpt.id
                    ? 'border-primary bg-surface-container-low shadow'
                    : 'border-surface-container bg-white hover:bg-surface-container-low/40'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="font-bold text-xs font-mono tracking-wide text-primary">
                    {rpt.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isPreset && (
                      <span className="text-[9px] bg-slate-100 text-[#7c7273] px-1.5 py-0.5 rounded select-none font-sans font-medium">
                        系统示例
                      </span>
                    )}
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      rpt.status === 'anomaly' ? 'bg-error' : 'bg-surface-variant border border-outline-variant'
                    }`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      {rpt.status === 'anomaly' ? '异常拦截' : '无碍通过'}
                    </span>
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-primary font-body-md line-clamp-1 mb-2">
                  {rpt.name}
                </h4>

                <div className="flex justify-between items-center w-full text-[10px] text-on-surface-variant font-mono">
                  <span>批次: {rpt.batchId}</span>
                  <span>{rpt.time.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right Content: Primary report view details (8 columns) */}
      <section className="flex-grow flex flex-col">
        
        {/* Dynamic export action icons bar */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4 border-b border-surface-container pb-4 select-none">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold text-secondary tracking-widest uppercase">
              文件审阅控制台
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => triggerExport('打印纸质报告')}
              className="p-2 border border-outline-variant rounded-lg hover:bg-surface text-secondary hover:text-primary transition-colors hover:border-primary"
              title="打印报告"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button 
              onClick={() => triggerExport('开始导出高清 PDF 件')}
              className="p-2 border border-outline-variant rounded-lg hover:bg-surface text-secondary hover:text-primary transition-colors hover:border-primary"
              title="导出 PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={() => triggerExport('生成专享加密分享链接')}
              className="p-2 border border-outline-variant rounded-lg hover:bg-surface text-secondary hover:text-primary transition-colors hover:border-primary"
              title="分享访问"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Report Layout Panel */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-8 md:p-12 shadow-md flex flex-col gap-10 prose prose-slate max-w-none relative overflow-hidden">
          
          {/* Subtle watermark overlay */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.02] pointer-events-none transform -rotate-12">
            <span className="text-[120px] font-black tracking-widest font-sans uppercase">X-INSPECT</span>
          </div>

          {/* Professional Header */}
          <header className="flex flex-col md:flex-row justify-between items-start border-b border-primary/40 pb-6 gap-6 relative z-10 select-none">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7c7273]">
                X-Inspect AI 工业无损诊断报告书
              </span>
              <h2 className="text-headline-xl font-bold tracking-tight text-primary mt-1 mb-0 pb-0">
                精密无损检测与智能分析诊断报告
              </h2>
            </div>
            
            <div className="text-right flex flex-col items-end font-mono text-[10px] gap-1 text-secondary">
              {selectedReport.isAiWritten && (
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm mb-1 animate-in fade-in zoom-in duration-350 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{selectedReport.aiModel || 'DEEPSEEK AI 专家实时撰写'}</span>
                </div>
              )}
              <span>报告编码: <span className="font-bold text-primary">{selectedReport.id}</span></span>
              <span>打印时点: {selectedReport.time}</span>
              <span>诊断流速: {selectedReport.duration}</span>
            </div>
          </header>

          {/* Specifications fields details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none bg-surface p-6 rounded-xl border border-surface-container relative z-10">
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-secondary font-bold mb-1">测试产品批次</span>
              <span className="text-xs font-mono font-bold text-primary">{selectedReport.batchId}</span>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider text-secondary font-bold mb-1">检测通过良率</span>
              <span className={`text-xs font-mono font-bold ${
                selectedReport.status === 'anomaly' ? 'text-primary' : 'text-primary'
              }`}>
                {selectedReport.status === 'anomaly' ? '98.0%' : '100%'}
              </span>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider text-secondary font-bold mb-1">审核模型版本</span>
              <span className="text-xs font-mono font-semibold text-primary">v2.4-rc1</span>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider text-secondary font-bold mb-1">诊断机审判定</span>
              <span className={`text-xs font-bold uppercase ${
                selectedReport.status === 'anomaly' ? 'text-error' : 'text-primary'
              }`}>
                {selectedReport.status === 'anomaly' ? '拦截复查 (ANOMALY)' : '合格通过 (PASS)'}
              </span>
            </div>
          </div>

          {/* Conclusion */}
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-primary mb-3">一、诊断核心结论 (Conclusion)</h3>
            <p className="text-xs leading-relaxed text-secondary text-justify">
              {selectedReport.conclusion}
            </p>
          </div>

          {/* Dynamic annotated defect images layout */}
          {selectedReport.defectImages && selectedReport.defectImages.length > 0 && (
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-primary mb-6">二、辐射诊断学扫描缺陷定位 (Defect Coordinates Map)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedReport.defectImages.map((df, i) => (
                  <div key={i} className="flex flex-col gap-4 border border-outline-variant p-4.5 rounded-xl bg-white/50">
                    <div className="bg-black aspect-video rounded-lg p-1 overflow-hidden relative border border-outline-variant flex items-center justify-center">
                      <img 
                        alt="Defect analysis segment" 
                        className="w-full h-full object-cover grayscale contrast-125 select-none"
                        src={df.imageUrl}
                      />
                      {/* Bounding box overlays precision coord estimation */}
                      <div 
                        className="absolute border-2 border-dashed border-error bg-error/15 z-10 pointer-events-none flex items-center justify-center"
                        style={df.coords}
                      >
                        <span className="text-[7px] text-white bg-error font-mono px-0.5 rounded ml-0.5 scale-75 transform origin-top-left font-black">
                          {df.defectCode.split(':')[0]}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-primary flex justify-between items-center">
                        <span>{df.title}</span>
                        <span className="text-[10px] font-mono bg-error-container/25 text-error px-2 py-0.5 rounded">
                          {df.defectCode}
                        </span>
                      </h4>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed text-justify mt-1 px-0.5">
                        {df.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations technical action */}
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-primary mb-4">三、工艺改进措施建议 (Technical Recommendations)</h3>
            <ol className="text-xs leading-relaxed text-secondary list-decimal pl-5 space-y-2 mt-0 border-b border-dashed border-[#EAEAEA] pb-6">
              {selectedReport.recommendations.map((rec, i) => (
                <li key={i} className="text-justify">{rec}</li>
              ))}
            </ol>
          </div>

          {/* DeepSeek AI Expert Diagnostic review */}
          <div className="relative z-10 bg-slate-50 border border-slate-200 rounded-xl p-6.5 select-none animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 bg-zinc-950 text-white rounded text-[10px] font-black uppercase font-mono tracking-wider">
                  DeepSeek R1/V3
                </div>
                <h3 className="text-sm font-black text-primary m-0">四、DeepSeek AI 专家大模型二级深度诊断 (Optional AI Extension)</h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                Model: deepseek-chat (128K context)
              </span>
            </div>

            <p className="text-xs text-secondary leading-relaxed mb-6">
              支持导入您的官方 DeepSeek API 秘钥（或通过免密钥模拟通道）由专业 NDT 冶金与探伤大脑建立更为精密、学术化的二极对齐成因剖析与生产物理调优。
            </p>

            {/* Config controls fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                  <Key className="w-3 h-3 text-zinc-500" />
                  DeepSeek API Key
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="请输入 sk- 开头的官方 DeepSeek 秘钥..." 
                    value={deepSeekKey}
                    onChange={(e) => setDeepSeekKey(e.target.value)}
                    className="w-full bg-white border border-zinc-200 px-3.5 py-2.5 rounded-lg text-xs font-mono text-primary placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
                <span className="text-[9px] text-zinc-500 block mt-1.5 leading-normal">
                  秘钥仅存储在浏览器本地（localStorage），传输由平台服务器中转保障信息安全。
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-zinc-500" />
                  自定义冶金物理诊断倾向
                </label>
                <textarea 
                  rows={2}
                  placeholder="针对焊接微气孔、缺陷圆形度与保护气体配比调整..." 
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full bg-white border border-zinc-200 px-3.5 py-2.5 rounded-lg text-xs font-sans text-primary placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Action Triggers footer */}
            <div className="flex flex-wrap items-center gap-3.5 border-b border-slate-200/60 pb-5 mb-5">
              <button
                type="button"
                onClick={() => handleDeepSeekAnalysis(false)}
                disabled={isDeepSeeking}
                className="px-5 py-2.5 bg-primary hover:bg-opacity-95 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-65 flex items-center gap-2 shadow-sm"
              >
                {isDeepSeeking ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                )}
                <span>连接 DeepSeek API 开始分析</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeepSeekAnalysis(true)}
                disabled={isDeepSeeking}
                className="px-5 py-2.5 border border-zinc-300 hover:bg-white text-primary rounded-lg text-xs font-bold transition-all disabled:opacity-65 flex items-center gap-1.5"
              >
                <span>免 Key 专家模拟通道 (Demo Simulator)</span>
              </button>
            </div>

            {/* Result Panel Render */}
            {(isDeepSeeking || deepSeekResult || deepSeekError) && (
              <div className="bg-zinc-950 text-slate-100 rounded-xl p-5 md:p-6 shadow-inner font-mono text-xs border border-zinc-800 leading-relaxed max-h-96 overflow-y-auto">
                {isDeepSeeking && (
                  <div className="flex items-center gap-3 text-zinc-400 py-4 select-none justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin text-zinc-300" />
                    <span>DeepSeek R1/V3 冶金探伤专家正在研判底层数据特征，生成精细学术报告，请稍候...</span>
                  </div>
                )}

                {deepSeekError && (
                  <div className="text-red-400 py-3 flex items-start gap-2 select-none">
                    <span className="font-extrabold uppercase bg-red-950 px-1.5 rounded text-[10px]">ERROR</span>
                    <span>{deepSeekError}</span>
                  </div>
                )}

                {deepSeekResult && (
                  <div className="prose prose-invert prose-xs max-w-none text-slate-200">
                    <div className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed text-justify">
                      {deepSeekResult}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Signature/Company validation stamp seal simulation */}
          <footer className="mt-12 pt-8 border-t border-surface-container flex justify-between items-end relative z-10 select-none">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xs font-bold text-primary m-0">X-Inspect AI 平台诊断检测部</p>
                <p className="text-[10px] text-on-surface-variant m-0 mt-0.5 font-mono">报告生成服务器: CLOUD-VAL-SERVER-12</p>
              </div>
            </div>

            {/* Simulated Round Stamp circle design */}
            <div className="relative w-24 h-24 rounded-full border-2 border-red-400 flex items-center justify-center pointer-events-none opacity-85 scale-90 md:scale-100 origin-bottom-right">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold text-red-500 transform tracking-wider w-16 text-center select-none uppercase font-sans leading-none">
                AI 诊断核定部<br />专用电子签章
              </span>
              <div className="absolute border border-dashed border-red-300 w-[84px] h-[84px] rounded-full top-1 left-1" />
            </div>
          </footer>

        </div>

      </section>

    </motion.div>
  );
}

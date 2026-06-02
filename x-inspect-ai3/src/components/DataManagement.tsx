/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ScanItem } from '../types';
import { INITIAL_SCANS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderOpen, Hourglass, Tag, AlertTriangle, HardDrive, 
  Search, SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight, X, Info
} from 'lucide-react';
import { getStoredScans } from '../utils/storage';

export default function DataManagement() {
  const [scans, setScans] = useState<ScanItem[]>(INITIAL_SCANS);
  const [activeCategory, setActiveCategory] = useState<'all' | 'pending' | 'labeled' | 'anomaly'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [selectedScan, setSelectedScan] = useState<ScanItem | null>(null);
  const [sortByConfidence, setSortByConfidence] = useState<boolean | null>(null); // null means default

  useEffect(() => {
    try {
      const data = getStoredScans();
      if (Array.isArray(data) && data.length > 0) {
        setScans(data);
      }
    } catch (err) {
      console.error('Failed to load scans:', err);
    }
  }, []);

  // Counts computed dynamically
  const counts = useMemo(() => {
    return {
      all: scans.length,
      pending: scans.filter(s => s.category === 'pending').length, 
      labeled: scans.filter(s => s.category === 'labeled').length,
      anomaly: scans.filter(s => s.category === 'anomaly').length
    };
  }, [scans]);

  // Filter & Search logic
  const filteredScans = useMemo(() => {
    return scans
      .filter(scan => {
        // Category filter
        if (activeCategory !== 'all' && scan.category !== activeCategory) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            scan.id.toLowerCase().includes(query) ||
            scan.name.toLowerCase().includes(query) ||
            (scan.defectType && scan.defectType.toLowerCase().includes(query))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortByConfidence === true) {
          return b.confidence - a.confidence;
        } else if (sortByConfidence === false) {
          return a.confidence - b.confidence;
        }
        return 0; // default order
      });
  }, [scans, activeCategory, searchQuery, sortByConfidence]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row gap-12"
    >
      {/* Sidebar categories & status panel */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-label-caps font-bold text-on-surface-variant mb-4 px-3 select-none">
            数据集视图
          </h3>
          
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all ${
              activeCategory === 'all'
                ? 'bg-surface-container-high text-primary font-bold'
                : 'hover:bg-surface-container-low text-secondary hover:text-primary'
            }`}
          >
            <FolderOpen className="w-[18px] h-[18px]" />
            所有扫描
            <span className="ml-auto text-mono-label font-bold text-on-surface-variant">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('pending')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all ${
              activeCategory === 'pending'
                ? 'bg-surface-container-high text-primary font-bold'
                : 'hover:bg-surface-container-low text-secondary hover:text-primary'
            }`}
          >
            <Hourglass className="w-[18px] h-[18px]" />
            待处理审阅
            <span className="ml-auto text-mono-label font-bold text-on-surface-variant">
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('labeled')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all ${
              activeCategory === 'labeled'
                ? 'bg-surface-container-high text-primary font-bold'
                : 'hover:bg-surface-container-low text-secondary hover:text-primary'
            }`}
          >
            <Tag className="w-[18px] h-[18px]" />
            已标注缺陷
            <span className="ml-auto text-mono-label font-bold text-on-surface-variant">
              {counts.labeled}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('anomaly')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all ${
              activeCategory === 'anomaly'
                ? 'bg-surface-container-high text-primary font-bold'
                : 'hover:bg-surface-container-low text-secondary hover:text-primary'
            }`}
          >
            <AlertTriangle className="w-[18px] h-[18px]" />
            严重异常件
            <span className="ml-auto text-mono-label font-bold text-on-surface-variant">
              {counts.anomaly}
            </span>
          </button>
        </div>

        {/* Local memory database sandboxing indicator */}
        <div className="mt-auto hidden md:block select-none">
          <div className="p-6 border border-surface-container rounded-xl bg-surface flex flex-col gap-4">
            <HardDrive className="w-6 h-6 text-primary" />
            <div>
              <h4 className="text-label-caps font-bold text-primary">本地内存沙箱 (Workspace Sandbox)</h4>
              <p className="text-xs text-on-surface-variant mt-1">在线状态：沙箱内存就绪</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">已装载图像: {scans.length}张 (含内置示例)</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main scanning items catalog list */}
      <section className="flex-1 flex flex-col">
        {/* Dataset filter toolbar context and togglers */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-surface-container rounded-full py-2.5 pl-9 pr-4 text-xs font-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-on-surface-variant"
              placeholder="搜索工件 ID、工艺、缺陷名称..."
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={() => {
                if (sortByConfidence === null) setSortByConfidence(true);
                else if (sortByConfidence === true) setSortByConfidence(false);
                else setSortByConfidence(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 border border-surface-container rounded text-xs font-semibold ${
                sortByConfidence !== null ? 'bg-surface-container-high text-primary' : 'bg-white text-secondary hover:text-primary'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {sortByConfidence === true ? '高置信度排序' : sortByConfidence === false ? '低置信度排序' : '默认排序'}
            </button>

            <div className="flex border border-surface-container rounded bg-white p-1 select-none">
              <button 
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded ${layoutMode === 'grid' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'}`}
                title="网格视图"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded ${layoutMode === 'list' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'}`}
                title="列表视图"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Items list represent */}
        {filteredScans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-surface-container rounded-xl bg-white">
            <AlertTriangle className="w-8 h-8 text-secondary mb-3" />
            <p className="text-sm font-semibold text-primary">未找到匹配的扫描批次</p>
            <p className="text-xs text-on-surface-variant mt-1">请重置您的过滤器或搜寻框搜索条件。</p>
          </div>
        ) : layoutMode === 'grid' ? (
          /* Grid Layout Rendering */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-bento-gap">
            {filteredScans.map((scan) => (
              <motion.div
                key={scan.id}
                layoutId={`card-container-${scan.id}`}
                onClick={() => setSelectedScan(scan)}
                className="border border-surface-container bg-white rounded-xl overflow-hidden flex flex-col group hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow"
              >
                <div className="aspect-[4/3] bg-black relative overflow-hidden p-1.5">
                  <img 
                    alt={scan.id} 
                    className="w-full h-full object-cover opacity-80 mix-blend-screen filter grayscale contrast-125 select-none"
                    src={scan.imageUrl}
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold tracking-wider border border-surface-container flex items-center gap-1.5 shadow-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      scan.category === 'anomaly' ? 'bg-error animate-pulse' : scan.category === 'pending' ? 'bg-primary border border-outline' : 'bg-primary'
                    }`} />
                    {scan.category === 'anomaly' ? 'ANOMALY (异常)' : scan.category === 'pending' ? 'REVIEW (待审)' : 'PASS (合格)'}
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-primary tracking-wide">
                      {scan.id}
                    </h4>
                    <span className="text-[11px] text-secondary font-mono tracking-tighter">
                      {scan.resolution}
                    </span>
                  </div>

                  <p className="text-xs font-mono-label text-on-surface-variant line-clamp-1">
                    {scan.name}
                  </p>

                  <div className="flex justify-between items-end border-t border-surface-container pt-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-secondary mb-1">
                        核心置信度
                      </p>
                      <p className="text-lg font-black text-primary">
                        {scan.confidence}%
                      </p>
                    </div>
                    <p className="text-xs text-on-surface-variant font-mono">
                      {scan.date} {scan.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List Layout Rendering */
          <div className="flex flex-col border border-surface-container rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 text-label-caps font-bold text-on-surface-variant uppercase bg-surface-container-low px-6 py-3 border-b border-surface-container">
              <span className="col-span-2">工件 ID</span>
              <span className="col-span-4">工件名称</span>
              <span className="col-span-2">置信评分</span>
              <span className="col-span-2">图像深度</span>
              <span className="col-span-2 text-right">检测时点</span>
            </div>
            <div className="divide-y divide-surface-container/60">
              {filteredScans.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  className="grid grid-cols-12 items-center px-6 py-4 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <span className="col-span-2 text-sm font-bold font-mono text-primary">{scan.id}</span>
                  <span className="col-span-4 text-xs font-medium text-secondary line-clamp-1 pr-2">{scan.name}</span>
                  <span className="col-span-2 text-sm font-black text-primary">{scan.confidence}%</span>
                  <span className="col-span-2 text-xs font-mono text-on-surface-variant">{scan.depth}</span>
                  <span className="col-span-2 text-xs text-right text-on-surface-variant font-mono">{scan.date} {scan.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Pagination controls */}
        <div className="mt-12 flex justify-center items-center gap-4 select-none">
          <button disabled className="p-2 border border-surface-container rounded bg-white hover:bg-surface-container-low transition-colors text-zinc-300 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-primary font-mono">1 / 1 页</span>
          <button disabled className="p-2 border border-surface-container rounded bg-white hover:bg-surface-container-low transition-colors text-zinc-300 disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* Detail Radiograph Overlay Modal */}
      <AnimatePresence>
        {selectedScan && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              layoutId={`card-container-${selectedScan.id}`}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-surface-container flex flex-col p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedScan(null)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-container text-secondary hover:text-primary transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-2 mb-4 items-center">
                <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono font-bold rounded uppercase tracking-wider">
                  {selectedScan.id}
                </span>
                <span className="text-secondary tracking-widest text-[9px] uppercase font-bold">
                  辐射成像无损诊断详情
                </span>
              </div>

              {/* High precision grayscale image frame */}
              <div className="bg-black aspect-video rounded-lg relative overflow-hidden border border-outline/20 p-1 flex items-center justify-center">
                <img 
                  alt="Inspection Detail Frame" 
                  className="w-full h-full object-cover opacity-95 grayscale contrast-125"
                  src={selectedScan.imageUrl}
                />
                
                {/* Defect mock indicator */}
                {selectedScan.category === 'anomaly' && (
                  <div className="absolute border-2 border-dashed border-error bg-error/20 p-2 text-[10px] font-mono text-white tracking-widest uppercase rounded" style={{ top: '35%', left: '42%' }}>
                    POROSITY_WARNING (88%)
                  </div>
                )}
              </div>

              {/* Full descriptive scan metadata specification parameters */}
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-primary text-sm mb-1">{selectedScan.name}</h4>
                  <p className="text-xs text-on-surface-variant">精密 X-Ray 电流功率：150kV | 曝光积分耗时: 350ms 的辐射诊断学特征剖析图。</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-surface-container pt-4">
                  <div className="p-3 bg-surface rounded">
                    <span className="block text-[9px] text-secondary uppercase font-bold tracking-wider">检测状态</span>
                    <span className="text-xs font-bold text-primary mt-1 block">
                      {selectedScan.category === 'anomaly' ? '发现焊接夹杂孔隙' : selectedScan.category === 'pending' ? '人工复审中' : '全功能合格放行'}
                    </span>
                  </div>
                  <div className="p-3 bg-surface rounded">
                    <span className="block text-[9px] text-secondary uppercase font-bold tracking-wider">层层采样深度</span>
                    <span className="text-xs font-mono font-semibold text-primary mt-1 block">{selectedScan.depth}</span>
                  </div>
                  <div className="p-3 bg-surface rounded">
                    <span className="block text-[9px] text-secondary uppercase font-bold tracking-wider">解析分辨率</span>
                    <span className="text-xs font-mono font-semibold text-primary mt-1 block">{selectedScan.resolution}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-surface-container">
                  <button 
                    onClick={() => setSelectedScan(null)}
                    className="px-5 py-2 border border-outline-variant hover:bg-surface text-primary rounded-full text-xs font-bold uppercase transition-colors"
                  >
                    返回列表
                  </button>
                  <button 
                    onClick={() => alert(`已为工件 ${selectedScan.id} 申请 AI 重构检测。`)}
                    className="px-5 py-2 bg-primary text-on-primary hover:opacity-90 rounded-full text-xs font-bold uppercase transition-transform"
                  >
                    启动 AI 模型重构
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

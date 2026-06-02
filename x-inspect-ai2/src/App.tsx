/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, NotificationItem } from './types';
import { INITIAL_NOTIFICATIONS } from './data';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DataManagement from './components/DataManagement';
import VisionEngine from './components/VisionEngine';
import AiTraining from './components/AiTraining';
import AnalysisCenter from './components/AnalysisCenter';
import Reports from './components/Reports';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Layout, Folder, Layers, Cpu, BarChart2, FileText, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const handleNotificationClick = (id: string, targetTab: ActiveTab) => {
    // 1. Mark as read immediately
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    // 2. Clear mobile menu if opened
    setMobileMenuOpen(false);
    // 3. Smooth transition navigation to target tab
    setActiveTab(targetTab);
  };


  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'datasets':
        return <DataManagement />;
      case 'vision':
        return <VisionEngine />;
      case 'training':
        return <AiTraining />;
      case 'analytics':
        return <AnalysisCenter />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const navItemsMobile: { label: string; tab: ActiveTab; icon: React.ReactNode }[] = [
    { label: '仪表盘 (Dashboard)', tab: 'dashboard', icon: <Layout className="w-5 h-5" /> },
    { label: '数据管理 (Datasets)', tab: 'datasets', icon: <Folder className="w-5 h-5" /> },
    { label: '视觉引擎 (Vision)', tab: 'vision', icon: <Layers className="w-5 h-5" /> },
    { label: 'AI 训练 (Training)', tab: 'training', icon: <Cpu className="w-5 h-5" /> },
    { label: '分析大屏 (Analytics)', tab: 'analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { label: '专业报告 (Reports)', tab: 'reports', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-primary flex flex-col relative selection:bg-black selection:text-white">
      
      {/* Background radial soft lights to simulate industrial clean-tech environments */}
      <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none select-none z-0 overflow-hidden">
        <div className="absolute top-[-250px] left-[5%] w-[800px] h-[800px] rounded-full bg-[#f1f3f9] opacity-70 filter blur-[150px]" />
        <div className="absolute top-[-100px] right-[10%] w-[500px] h-[500px] rounded-full bg-[#f8f6f4] opacity-50 filter blur-[120px]" />
      </div>

      {/* Global Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />

      {/* MOBILE TRIGGER (Floats in bottom right corner on screens, or header left) */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Slide Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-45 md:hidden">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-80 h-full bg-white border-l border-[#EAEAEA] p-8 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black text-primary tracking-wider uppercase mb-1">X-Inspect AI</h3>
                  <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
                    移动端快速导航面板
                  </p>
                </div>

                <nav className="flex flex-col gap-2">
                  {navItemsMobile.map((item) => (
                    <button
                      key={item.tab}
                      onClick={() => {
                        setActiveTab(item.tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-4.5 px-4 py-3.5 rounded-lg border text-xs font-bold uppercase transition-all ${
                        activeTab === item.tab
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white border-[#EAEAEA] text-[#7c7273] hover:text-primary hover:border-black'
                      }`}
                    >
                      {item.icon}
                      <span className="flex-grow">{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-[#EAEAEA] text-[10px] text-on-surface-variant font-mono">
                <span>边缘视觉连接已就绪 (Uptime: 14h)</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Primary Interactive Section Content */}
      <main className="flex-1 pt-24 relative z-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Clean Typography Footer */}
      <footer className="w-full py-10 border-t border-surface-container bg-white text-[11px] font-semibold text-secondary relative z-10 select-none">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="m-0">
            © 2026 X-Inspect AI, Inc. 保留所有无损检测视觉重构权力。
          </p>
          <div className="flex gap-6 font-mono text-xs text-on-surface-variant">
            <span className="hover:text-primary cursor-pointer transition-colors">检测标准</span>
            <span>•</span>
            <span className="hover:text-primary cursor-pointer transition-colors">隐私条款</span>
            <span>•</span>
            <span className="hover:text-primary cursor-pointer transition-colors">安全技术白皮书</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

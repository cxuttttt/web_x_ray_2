/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, NotificationItem } from '../types';
import { Bell, Settings, Layers, Folder, Cpu, BarChart2, FileText, Layout, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  notifications: NotificationItem[];
  onNotificationClick: (id: string, targetTab: ActiveTab) => void;
}


export default function Header({ activeTab, setActiveTab, notifications, onNotificationClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTeam, setShowTeam] = useState(false);

  const navItems: { label: string; tab: ActiveTab; icon: React.ReactNode }[] = [
    { label: '仪表盘', tab: 'dashboard', icon: <Layout className="w-4 h-4" /> },
    { label: '数据管理', tab: 'datasets', icon: <Folder className="w-4 h-4" /> },
    { label: '视觉引擎', tab: 'vision', icon: <Layers className="w-4 h-4" /> },
    { label: 'AI 训练', tab: 'training', icon: <Cpu className="w-4 h-4" /> },
    { label: '分析大屏', tab: 'analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { label: '专业报告', tab: 'reports', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-surface-container transition-all">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
        
        {/* Brand/Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-black text-lg select-none">Q</span>
          </div>
          <span className="text-body-lg font-bold tracking-tighter text-primary uppercase select-none">
            缺陷检测智能平台
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-6 items-center h-full">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`h-full flex items-center text-label-caps font-semibold uppercase transition-all duration-200 px-3 relative border-b-2 ${
                activeTab === item.tab
                  ? 'text-primary border-primary'
                  : 'text-secondary hover:text-primary border-transparent'
              }`}
            >
              <span className="mr-1.5 opacity-70">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Trailing Quick Actions */}
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
            }}
            className={`p-2 rounded-full hover:bg-surface-container transition-all relative ${
              showNotifications ? 'bg-surface-container text-primary' : 'text-secondary hover:text-primary'
            }`}
            title="通知公告"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white animate-pulse" />
            )}
          </button>
          
          <button 
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
            }}
            className={`p-2 rounded-full hover:bg-surface-container transition-all ${
              showSettings ? 'bg-surface-container text-primary' : 'text-secondary hover:text-primary'
            }`}
            title="系统设置"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button 
            onClick={() => {
              setShowTeam(!showTeam);
              setShowNotifications(false);
              setShowSettings(false);
            }}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border border-zinc-200 bg-slate-50 text-xs font-black transition-all hover:bg-slate-100 select-none ${
              showTeam ? 'bg-zinc-950 text-white border-zinc-950' : 'text-primary'
            }`}
            title="制作开发团队 (Research Team)"
          >
            <Users className="w-4 h-4" />
            <span>Team</span>
          </button>

          {/* Quick Team/Credits Panel */}
          {showTeam && (
            <div className="absolute right-0 top-12 w-72 bg-white border border-[#EAEAEA] rounded-2xl shadow-2xl p-6 z-50 select-none animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-zinc-900" />
                  <span className="font-extrabold text-xs text-primary uppercase tracking-wider">系统研制开发团队</span>
                </div>
                <button 
                  onClick={() => setShowTeam(false)}
                  className="text-[10px] text-zinc-400 hover:text-zinc-600 font-bold uppercase"
                >
                  关闭
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5 group/member">
                  <div className="w-8 h-8 rounded bg-zinc-950 font-black text-white text-xs flex items-center justify-center shrink-0">
                    森
                  </div>
                  <div>
                    <span className="text-xs font-black text-primary block">曹森</span>
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest block mt-0.5">算法工程师</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 group/member">
                  <div className="w-8 h-8 rounded bg-zinc-950 font-black text-white text-xs flex items-center justify-center shrink-0">
                    京
                  </div>
                  <div>
                    <span className="text-xs font-black text-primary block">刘京</span>
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest block mt-0.5">数据处理和筛选</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 group/member">
                  <div className="w-8 h-8 rounded bg-zinc-950 font-black text-white text-xs flex items-center justify-center shrink-0">
                    诚
                  </div>
                  <div>
                    <span className="text-xs font-black text-primary block">易鑫诚</span>
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest block mt-0.5">前后端交互</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 text-[9px] font-mono font-medium text-zinc-400 text-center leading-relaxed">
                研制：工业级 NDT X 光无损智能诊断系统<br />
                © 缺陷检测智能平台 2026
              </div>
            </div>
          )}

          {/* Quick Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl p-5 z-50 select-none animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex justify-between items-center mb-3.5 pb-2 border-b border-zinc-100">
                <span className="text-xs font-black text-primary tracking-wider uppercase">实时监控与报告警报</span>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 uppercase"
                >
                  关闭
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-400">
                    暂无任何异常警告或诊断报告。
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        onNotificationClick(notif.id, notif.targetTab);
                        setShowNotifications(false);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:bg-slate-50 relative group ${
                        notif.read 
                          ? 'bg-white border-zinc-150 text-zinc-400' 
                          : notif.type === 'anomaly'
                            ? 'bg-red-50/60 border-red-100 hover:bg-red-50 text-red-950 font-medium'
                            : 'bg-zinc-50 border-zinc-200 hover:bg-slate-100 text-zinc-900 font-medium'
                      }`}
                    >
                      {/* Red unread Indicator dot inside the notification if not read */}
                      {!notif.read && (
                        <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      )}
                      
                      <span className={`block pr-3 leading-snug font-bold ${!notif.read ? 'text-primary' : 'text-zinc-400'}`}>
                        {notif.title}
                      </span>
                      <span className="block mt-1 text-[10px] text-zinc-500 font-normal leading-relaxed">
                        {notif.subtitle}
                      </span>
                      
                      <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-dashed border-zinc-100 text-[9px] text-zinc-400 font-mono">
                        <span>{notif.time}</span>
                        <span className="text-[10px] font-bold text-zinc-900 group-hover:underline flex items-center gap-0.5">
                          点击前往 {
                            notif.targetTab === 'vision' ? '视觉引擎 ➔' :
                            notif.targetTab === 'reports' ? '专业报告 ➔' : '查看 ➔'
                          }
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Quick Settings Panel */}
          {showSettings && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-surface-container rounded-lg shadow-2xl p-4 z-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-primary">引擎本地偏好</span>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-xs text-secondary hover:text-primary"
                >
                  关闭
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-secondary mb-1">自动检测流延迟</label>
                  <select className="w-full bg-surface border-none rounded p-1.5 text-primary text-xs focus:ring-1 focus:ring-primary">
                    <option>极速延迟 (10ms - 20ms)</option>
                    <option>平衡采样 (50ms - 100ms)</option>
                    <option>超清对比 (200ms)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-secondary mb-1">数据加密储存</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="checkbox" defaultChecked className="rounded border-outline text-primary focus:ring-primary" id="encrypt" />
                    <label htmlFor="encrypt" className="text-on-surface select-none">AES-256 全域加密</label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

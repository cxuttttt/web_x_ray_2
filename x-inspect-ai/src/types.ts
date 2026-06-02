/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveTab = 'dashboard' | 'datasets' | 'vision' | 'training' | 'analytics' | 'reports';

export interface ScanItem {
  id: string;
  name: string;
  category: 'all' | 'pending' | 'labeled' | 'anomaly';
  imageUrl: string;
  confidence: number;
  date: string;
  time: string;
  defectType?: string;
  resolution: string;
  depth: string;
}

export interface LiveDetectLog {
  timestamp: string;
  partId: string;
  result: 'pass' | 'fail';
  defectType?: string;
  confidence?: number;
}

export interface TrainingVersion {
  id: string;
  name: string;
  isActive: boolean;
  date: string;
  epochs: number;
  map: number;
  status: 'Production' | 'Archived' | 'Development';
}

export interface ReportItem {
  id: string;
  batchId: string;
  name: string;
  status: 'anomaly' | 'normal';
  time: string;
  duration: string;
  conclusion: string;
  defectImages: {
    title: string;
    description: string;
    imageUrl: string;
    defectCode: string;
    coords: { top: string; left: string; width: string; height: string };
  }[];
  recommendations: string[];
  isAiWritten?: boolean;
  aiModel?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: 'anomaly' | 'report';
  targetTab: ActiveTab;
  read: boolean;
}


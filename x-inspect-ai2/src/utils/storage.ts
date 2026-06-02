import { ScanItem, ReportItem } from '../types';
import { INITIAL_SCANS, INITIAL_REPORTS } from '../data';

const SCANS_KEY = 'ndt_user_scans';
const REPORTS_KEY = 'ndt_user_reports';

/**
 * Loads both custom scans stored locally in browser storage and standard preset scans
 */
export function getStoredScans(): ScanItem[] {
  if (typeof window === 'undefined') return INITIAL_SCANS;
  try {
    const local = localStorage.getItem(SCANS_KEY);
    if (!local) return INITIAL_SCANS;
    const parsed = JSON.parse(local);
    if (Array.isArray(parsed)) {
      // Custom user uploads come first, then native preset images
      return [...parsed, ...INITIAL_SCANS];
    }
  } catch (e) {
    console.warn('Error reading localStorage user scans:', e);
  }
  return INITIAL_SCANS;
}

/**
 * Saves a single custom scanned workpiece securely in user's browser context
 */
export function saveStoredScan(scan: ScanItem): void {
  if (typeof window === 'undefined') return;
  try {
    const local = localStorage.getItem(SCANS_KEY);
    const parsed = local ? JSON.parse(local) : [];
    if (Array.isArray(parsed)) {
      const index = parsed.findIndex((s: any) => s.id === scan.id);
      if (index > -1) {
        parsed[index] = scan;
      } else {
        parsed.unshift(scan);
      }
      localStorage.setItem(SCANS_KEY, JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('Error storing workflow scan inside localStorage:', e);
  }
}

/**
 * Loads customized reports compiled via model interactions together with preset cases
 */
export function getStoredReports(): ReportItem[] {
  if (typeof window === 'undefined') return INITIAL_REPORTS;
  try {
    const local = localStorage.getItem(REPORTS_KEY);
    if (!local) return INITIAL_REPORTS;
    const parsed = JSON.parse(local);
    if (Array.isArray(parsed)) {
      return [...parsed, ...INITIAL_REPORTS];
    }
  } catch (e) {
    console.warn('Error reading stored user reports:', e);
  }
  return INITIAL_REPORTS;
}

/**
 * Persists newly written report locally for browser storage isolate
 */
export function saveStoredReport(report: ReportItem): void {
  if (typeof window === 'undefined') return;
  try {
    const local = localStorage.getItem(REPORTS_KEY);
    const parsed = local ? JSON.parse(local) : [];
    if (Array.isArray(parsed)) {
      const index = parsed.findIndex((r: any) => r.id === report.id);
      if (index > -1) {
        parsed[index] = report;
      } else {
        parsed.unshift(report);
      }
      localStorage.setItem(REPORTS_KEY, JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('Error storing compiled report inside localStorage:', e);
  }
}

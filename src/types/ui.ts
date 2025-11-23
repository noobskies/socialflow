export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  COMPOSER = 'COMPOSER',
  CALENDAR = 'CALENDAR',
  ANALYTICS = 'ANALYTICS',
  INBOX = 'INBOX',
  LIBRARY = 'LIBRARY',
  SETTINGS = 'SETTINGS',
  LINKS = 'LINKS',
  AUTOMATIONS = 'AUTOMATIONS',
}

export type ToastType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'mention';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

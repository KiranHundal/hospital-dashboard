export type ViewType = 'list' | 'grid';
export type ToastType = 'success' | 'error' | 'warning';

export interface HeaderProps {
  patientCount: number;
  isConnected: boolean;
  lastUpdate?: string;
  layout: ViewType;
  setLayout: (layout: ViewType) => void;
  isSplitScreen: boolean;
  toggleSplitScreen: () => void;
  refreshData: () => void;
}
export interface HeaderTitleProps {
  isConnected: boolean;
  formattedDate: string;
 }
export interface BuildInfoProps {
  version: string;
  buildTime: string;
}

export interface ToastMessage {
  message: string;
  type: ToastType;
}

export interface ViewControlsProps {
  layout: ViewType;
  setLayout: (layout: ViewType) => void;
  isSplitScreen: boolean;
  toggleSplitScreen: () => void;
}
export interface ViewButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
 }

export interface ConnectionControlProps {
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}
export interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
 }
export interface RefreshButtonProps {
    onClick: () => void;
   }

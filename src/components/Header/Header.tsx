import { useState, useEffect } from "react";
import { format } from "date-fns";
import { WebSocketService } from "../../services/WebSocketService";
import { getBuildInfo } from "../../utils/getBuildInfo";
import { Toast } from "../ui/Toast";
import { useTheme } from "../../hooks/useTheme";
import { HeaderProps } from "../../types/header";
import {
  HeaderTitle,
  ViewControls,
  ThemeToggle,
  RefreshButton,
  BuildInfo,
} from ".";
import { ConnectionButton } from "./ConnectionButton";
export const Header = ({
  isConnected,
  lastUpdate,
  layout,
  setLayout,
  isSplitScreen,
  toggleSplitScreen,
  refreshData,
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const [buildInfo, setBuildInfo] = useState<{
    version: string;
    buildTime: string;
  } | null>(null);
  const [wsConnected, setWsConnected] = useState(isConnected);
  const [isConnecting, setIsConnecting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const wsService = WebSocketService.getInstance();

  useEffect(() => {
    getBuildInfo().then(setBuildInfo);
  }, []);

  const formattedDate = lastUpdate
    ? format(new Date(lastUpdate), "EEEE, MMMM d, yyyy • h:mm a")
    : "No updates received";

  const handleConnect = () => {
    setIsConnecting(true);
    wsService.connect({
      onConnect: () => {
        setWsConnected(true);
        setIsConnecting(false);
        setToast({ message: "Connected to WebSocket!", type: "success" });
      },
      onDisconnect: () => {
        setWsConnected(false);
        setIsConnecting(false);
        setToast({ message: "Disconnected from WebSocket.", type: "error" });
      },
    });
  };

  const handleDisconnect = () => {
    wsService.disconnect();
    setWsConnected(false);
    setToast({ message: "WebSocket Disconnected.", type: "warning" });
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="w-full max-w-screen-2xl mx-auto">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <HeaderTitle
              isConnected={wsConnected}
              formattedDate={formattedDate}
            />

            <div className="flex items-center space-x-2">
              <ConnectionButton
                isConnecting={isConnecting}
                wsConnected={wsConnected}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />

              <div className="h-6 mx-2 border-l border-gray-200 dark:border-gray-700" />

              <ViewControls
                layout={layout}
                setLayout={setLayout}
                isSplitScreen={isSplitScreen}
                toggleSplitScreen={toggleSplitScreen}
              />

              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

              <RefreshButton onClick={refreshData} />
            </div>
          </div>
        </div>

        {buildInfo && <BuildInfo {...buildInfo} />}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </header>
  );
};

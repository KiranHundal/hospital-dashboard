import { useEffect, useState } from "react";
import {
  MoonIcon,
  SunIcon,
  GridIcon,
  ListIcon,
  Split,
  RefreshCw,
  Loader
} from "lucide-react";
import { format } from "date-fns";
import { WebSocketService } from "../../services/WebSocketService";
import { getBuildInfo } from "../../utils/getBuildInfo";
import { Toast } from "../ui/Toast";
import { useTheme } from "../../hooks/useTheme";

interface HeaderProps {
  patientCount: number;
  isConnected: boolean;
  lastUpdate?: string;
  layout: "list" | "grid";
  setLayout: (layout: "list" | "grid") => void;
  isSplitScreen: boolean;
  toggleSplitScreen: () => void;
  refreshData: () => void;
}

export const Header = ({
  isConnected,
  lastUpdate,
  layout,
  setLayout,
  isSplitScreen,
  toggleSplitScreen,
  refreshData
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const [buildInfo, setBuildInfo] = useState<{ version: string; buildTime: string } | null>(null);
  const [wsConnected, setWsConnected] = useState(isConnected);
  const [isConnecting, setIsConnecting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const wsService = WebSocketService.getInstance();

  useEffect(() => {
    getBuildInfo().then((info) => setBuildInfo(info));
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
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Hospital Patient Dashboard
                </h1>
                {wsConnected ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
                    Connected
                  </span>
                ) : null}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
            </div>

            <div className="flex items-center space-x-2">
              {isConnecting ? (
                <button
                  disabled
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-400 dark:bg-gray-800"
                >
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </button>
              ) : wsConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                >
                  Connect
                </button>
              )}

              <div className="h-6 mx-2 border-l border-gray-200 dark:border-gray-700" />

              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
                <button
                  onClick={() => setLayout("grid")}
                  className={`p-1.5 rounded ${
                    layout === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  aria-label="Grid view"
                >
                  <GridIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-1.5 rounded ${
                    layout === "list"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  aria-label="List view"
                >
                  <ListIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={toggleSplitScreen}
                  className={`p-1.5 rounded ${
                    isSplitScreen
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  aria-label="Split screen"
                >
                  <Split className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <SunIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              <button
                onClick={refreshData}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Refresh data"
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {buildInfo && (
          <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Version {buildInfo.version} • Built {new Date(buildInfo.buildTime).toLocaleDateString()}
            </div>
          </div>
        )}
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

export default Header;

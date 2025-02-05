import { layoutStyles } from "../../styles";
import { colorStyles } from "../../styles/colors";
import clsx from "clsx";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => (
  <div className="flex items-center">
    <div
      className={clsx(
        layoutStyles.status.dot.base,
        isConnected
          ? layoutStyles.status.dot.connected
          : layoutStyles.status.dot.disconnected
      )}
    ></div>
    <span className={clsx(colorStyles.text.muted, "ml-2 text-sm")}>
      {isConnected ? "Connected" : "Disconnected"}
    </span>
  </div>
);

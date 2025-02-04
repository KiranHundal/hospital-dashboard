import { ConnectButton } from "./ConnectButton";
import { DisconnectButton } from "./DisconnectButton";
import { LoadingButton } from "./LoadingButton";

interface ConnectionButtonProps {
    isConnecting: boolean;
    wsConnected: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
   }

   export const ConnectionButton = ({
    isConnecting,
    wsConnected,
    onConnect,
    onDisconnect
   }: ConnectionButtonProps) => {
    if (isConnecting) return <LoadingButton />;
    return wsConnected ? <DisconnectButton onClick={onDisconnect} /> : <ConnectButton onClick={onConnect} />;
   };

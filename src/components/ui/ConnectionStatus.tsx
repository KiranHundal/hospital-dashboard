interface ConnectionStatusProps {
    isConnected: boolean;
  }

  export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => (
    <div className="flex items-center">
      <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="ml-2 text-sm text-gray-600">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );

import { WifiOff } from "lucide-react";

const OfflineIndicator = () => {
  return (
    <div className="offline-indicator fixed top-0 left-0 right-0 bg-warning text-white p-2 text-center text-sm z-50">
      <WifiOff className="h-4 w-4 mr-2 inline-block" />
      Você está offline. Os dados serão sincronizados quando a conexão for restabelecida.
    </div>
  );
};

export default OfflineIndicator;

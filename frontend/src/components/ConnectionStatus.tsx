import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      await apiService.healthCheck();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null || isChecking) {
    return (
      <div className="px-4 py-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          Checking connection...
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="px-4 py-3 bg-red-50 border-l-4 border-red-400 text-red-800">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-semibold mb-1">⚠️ Connection Issue</p>
            <p className="text-sm mb-2">
              Unable to connect to the API server. Please check your connection and try again.
            </p>
          </div>
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 rounded transition-colors disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 bg-green-50 border-l-4 border-green-400 text-green-800 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        Connected to backend API
      </div>
    </div>
  );
}


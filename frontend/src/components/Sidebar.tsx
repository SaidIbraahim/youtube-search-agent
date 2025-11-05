import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { CacheStats } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCacheStats = async () => {
    setIsLoading(true);
    try {
      const stats = await apiService.getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      // Silently handle error - don't show cache stats if unavailable
      setCacheStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await apiService.clearCache();
      await fetchCacheStats();
    } catch (error) {
      // Silently handle error - cache clear may have failed
      // User can retry if needed
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCacheStats();
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:fixed lg:top-0 lg:right-0 lg:z-30
          ${isOpen ? 'lg:translate-x-0' : 'lg:translate-x-full'}
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Settings & Info</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-100 transition-colors p-1 rounded hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Cache Statistics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Cache Statistics</h3>
              <button
                onClick={fetchCacheStats}
                disabled={isLoading}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {cacheStats ? (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cache Hits</span>
                  <span className="text-lg font-bold text-green-600">{cacheStats.hits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cache Misses</span>
                  <span className="text-lg font-bold text-orange-600">{cacheStats.misses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Size</span>
                  <span className="text-lg font-bold text-gray-800">{cacheStats.size} items</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <button
                    onClick={handleClearCache}
                    className="w-full btn-secondary text-sm py-2"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 text-sm">
                {isLoading ? 'Loading...' : 'No cache data available'}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-700">📊 View API Docs</span>
                <p className="text-sm text-gray-500 mt-1">Open API documentation</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-700">🔍 View Examples</span>
                <p className="text-sm text-gray-500 mt-1">Browse example queries</p>
              </button>
            </div>
          </div>

          {/* About */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">About</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                YouTube Assistant is powered by advanced AI with recursive tool-calling capabilities.
              </p>
              <p>
                Built with React, TypeScript, and FastAPI.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}


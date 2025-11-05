import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Connection Status Banner */}
      <ConnectionStatus />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content */}
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:pr-80' : ''}`}>
          <div className={`flex-1 mx-auto w-full ${sidebarOpen ? 'lg:max-w-[calc(100%-20rem)]' : 'max-w-7xl'} px-4 sm:px-6 lg:px-8 py-6 lg:py-8`}>
            <div className="h-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <Chat
                messages={messages}
                isLoading={isLoading}
                onSendMessage={sendMessage}
                onClear={clearMessages}
              />
            </div>
            
            {error && (
              <div className="mt-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-md">
                  <p className="font-semibold text-red-800">Error: {error}</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar - Toggleable, positioned on right */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Desktop Sidebar Toggle Button - Only show when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:fixed lg:top-24 lg:right-6 z-40 bg-white border-2 border-gray-300 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:border-primary-500 hover:bg-primary-50"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default App;


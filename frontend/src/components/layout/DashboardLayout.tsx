import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { DemoHeader } from './DemoHeader';
import { AIGeneratorModal } from '../features/teacher/AIGeneratorModal';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Demo Header */}
      <DemoHeader />

      <div className="flex-1 flex w-full">
        {/* Responsive Navigation Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            onMenuClick={() => setIsSidebarOpen(true)}
            onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
          />
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet context={{ openAIGenerator: () => setIsAIGeneratorOpen(true) }} />
          </main>
        </div>
      </div>

      {/* Global AI Generator Modal */}
      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
      />
    </div>
  );
};

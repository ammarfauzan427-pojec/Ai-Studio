import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CreativeSuite from './modules/CreativeSuite';
import CompositionSuite from './modules/CompositionSuite';
import MasterMaker from './modules/MasterMaker';
import BrandLock from './modules/BrandLock';
import Dashboard from './modules/Dashboard';
import { BrandProfile } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeBrandProfile, setActiveBrandProfile] = useState<BrandProfile | null>(null);
  
  // Real-time Credit State
  const [credits, setCredits] = useState<number>(2450);

  const handleDeductCredits = (amount: number) => {
    setCredits(prev => Math.max(0, prev - amount));
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} credits={credits} />;
      case 'creative':
        return <CreativeSuite brandProfile={activeBrandProfile} onDeductCredits={handleDeductCredits} />;
      case 'composition':
        return <CompositionSuite brandProfile={activeBrandProfile} onDeductCredits={handleDeductCredits} />;
      case 'master':
        return <MasterMaker brandProfile={activeBrandProfile} onDeductCredits={handleDeductCredits} />;
      case 'brand':
        return <BrandLock activeProfile={activeBrandProfile} setActiveProfile={setActiveBrandProfile} />;
      default:
        return <Dashboard setCurrentTab={setCurrentTab} credits={credits} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 z-10 flex items-center gap-3">
             <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                <span className="text-xs text-slate-400 font-medium">Credits:</span>
                <span className="text-sm font-bold text-white font-mono">{credits.toLocaleString()}</span>
             </div>

             {activeBrandProfile && currentTab !== 'brand' && (
                 <div className="bg-indigo-900/40 backdrop-blur border border-indigo-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-indigo-200 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                    Locked: {activeBrandProfile.name}
                 </div>
             )}
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
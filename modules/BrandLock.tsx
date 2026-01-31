import React from 'react';
import { BrandProfile } from '../types';
import { Lock, ShieldCheck, Palette, Sun } from 'lucide-react';

interface BrandLockProps {
  activeProfile: BrandProfile | null;
  setActiveProfile: (p: BrandProfile | null) => void;
}

const BrandLock: React.FC<BrandLockProps> = ({ activeProfile, setActiveProfile }) => {
  
  // Mock profiles
  const profiles: BrandProfile[] = [
    { id: '1', name: 'Summer Collection', primaryColor: '#FF5733', tone: 'Warm', contrast: 'Soft/Airy', style: 'Minimalist' },
    { id: '2', name: 'Executive Line', primaryColor: '#2C3E50', tone: 'Cool', contrast: 'Bold/High-Contrast', style: 'Luxury' },
    { id: '3', name: 'Eco Earth', primaryColor: '#27AE60', tone: 'Neutral', contrast: 'Soft/Airy', style: 'Vintage' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Lock className="text-indigo-500" size={32} />
          Brand Consistency Lock
        </h2>
        <p className="text-slate-400 mt-2 text-lg">Manage brand DNA profiles to ensure 100% consistency across all generated assets.</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Profile Selector */}
        <div className="col-span-1 space-y-4">
          <h3 className="text-slate-300 font-medium mb-4">Saved Profiles</h3>
          {profiles.map(p => (
            <div 
              key={p.id}
              onClick={() => setActiveProfile(p)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeProfile?.id === p.id 
                  ? 'bg-indigo-900/30 border-indigo-500 ring-1 ring-indigo-500/50' 
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">{p.name}</span>
                {activeProfile?.id === p.id && <ShieldCheck className="text-indigo-400" size={18} />}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-full" style={{ background: p.primaryColor }}></span>
                {p.style} • {p.tone}
              </div>
            </div>
          ))}
          
          <button className="w-full py-3 border border-dashed border-slate-700 text-slate-500 rounded-xl hover:border-slate-500 hover:text-slate-300 transition-colors">
            + Create New Profile
          </button>
        </div>

        {/* Details Panel */}
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {activeProfile ? (
            <div className="space-y-8">
              <div className="flex justify-between items-start border-b border-slate-800 pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{activeProfile.name}</h3>
                  <p className="text-indigo-400 text-sm">Active Profile - Features Locked</p>
                </div>
                <div className="px-4 py-2 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                  READY FOR PRODUCTION
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-slate-300 font-medium">
                    <Palette size={18} /> Color Palette Lock
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Primary</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-mono text-slate-500">{activeProfile.primaryColor}</span>
                         <div className="w-6 h-6 rounded border border-slate-700" style={{ background: activeProfile.primaryColor }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Color Grading</span>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">Auto-Match</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-slate-300 font-medium">
                    <Sun size={18} /> Lighting Tone Lock
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Temp</span>
                        <span className="text-xs font-bold text-white">{activeProfile.tone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Contrast</span>
                        <span className="text-xs font-bold text-white">{activeProfile.contrast}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-lg">
                <p className="text-sm text-indigo-300">
                  <span className="font-bold">Impact:</span> All images generated in Creative Suite, Composition, and Master Maker will automatically adopt these style parameters.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
               <ShieldCheck size={48} className="mb-4 opacity-20" />
               <p>Select a profile to view and edit lock settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandLock;

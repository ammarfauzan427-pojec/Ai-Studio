import React from 'react';
import { Activity, Image as ImageIcon, Video, TrendingUp, Zap, Coins } from 'lucide-react';

interface DashboardProps {
    setCurrentTab: (t: string) => void;
    credits: number;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentTab, credits }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto overflow-y-auto h-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Production Overview</h2>
          <p className="text-slate-400 mt-1">Welcome back. Your studio is ready.</p>
        </div>
        <div className="text-right bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
            <p className="text-xs text-slate-500 flex items-center justify-end gap-1 mb-1">
                <Zap size={12} className="text-yellow-500"/> Real-time Balance
            </p>
            <p className="text-3xl font-bold text-white flex items-center justify-end gap-2">
                {credits.toLocaleString()} <span className="text-sm font-normal text-slate-500">Credits</span>
            </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">
         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group relative overflow-hidden" onClick={() => setCurrentTab('creative')}>
            <div className="absolute top-0 right-0 bg-indigo-500/20 px-2 py-1 rounded-bl-lg text-[10px] text-indigo-300 font-mono">
                ~5 Credits
            </div>
            <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors text-indigo-400">
                <ImageIcon size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Creative Suite</h3>
            <p className="text-sm text-slate-400">Generate prompts and visuals from scratch.</p>
         </div>
         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group relative overflow-hidden" onClick={() => setCurrentTab('composition')}>
            <div className="absolute top-0 right-0 bg-purple-500/20 px-2 py-1 rounded-bl-lg text-[10px] text-purple-300 font-mono">
                10 Credits
            </div>
            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors text-purple-400">
                <Activity size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Image Composition</h3>
            <p className="text-sm text-slate-400">Merge products and models seamlessly.</p>
         </div>
         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group relative overflow-hidden" onClick={() => setCurrentTab('master')}>
            <div className="absolute top-0 right-0 bg-cyan-500/20 px-2 py-1 rounded-bl-lg text-[10px] text-cyan-300 font-mono">
                8 Credits/img
            </div>
            <div className="bg-cyan-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors text-cyan-400">
                <Video size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Master Maker</h3>
            <p className="text-sm text-slate-400">Instant studio-quality product shots.</p>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-400" />
                Recent Activity
            </h3>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="pb-3 pl-2">Asset</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Module</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Date</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-slate-300">
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-4 pl-2 font-medium text-white">Serum_Launch_V2.png</td>
                        <td className="py-4">Image</td>
                        <td className="py-4">Master Maker</td>
                        <td className="py-4"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Ready</span></td>
                        <td className="py-4 text-right text-slate-500">2 mins ago</td>
                    </tr>
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-4 pl-2 font-medium text-white">Spring Campaign Prompt</td>
                        <td className="py-4">Text</td>
                        <td className="py-4">Creative Suite</td>
                        <td className="py-4"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Generated</span></td>
                        <td className="py-4 text-right text-slate-500">1 hour ago</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* Pricing Info Panel */}
        <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Coins size={18} className="text-yellow-400" />
                Feature Costs
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div>
                        <p className="text-sm font-bold text-slate-200">Creative Prompt</p>
                        <p className="text-[10px] text-slate-500">Text generation</p>
                    </div>
                    <span className="text-yellow-500 font-mono font-bold">1 Cr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div>
                        <p className="text-sm font-bold text-slate-200">Creative Image</p>
                        <p className="text-[10px] text-slate-500">Single generation</p>
                    </div>
                    <span className="text-yellow-500 font-mono font-bold">5 Cr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div>
                        <p className="text-sm font-bold text-slate-200">Master Maker</p>
                        <p className="text-[10px] text-slate-500">Per image variation</p>
                    </div>
                    <span className="text-yellow-500 font-mono font-bold">8 Cr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div>
                        <p className="text-sm font-bold text-slate-200">Composition</p>
                        <p className="text-[10px] text-slate-500">Complex blending</p>
                    </div>
                    <span className="text-yellow-500 font-mono font-bold">10 Cr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div>
                        <p className="text-sm font-bold text-slate-200">Ad-Intelligence</p>
                        <p className="text-[10px] text-slate-500">Analysis per image</p>
                    </div>
                    <span className="text-yellow-500 font-mono font-bold">2 Cr</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
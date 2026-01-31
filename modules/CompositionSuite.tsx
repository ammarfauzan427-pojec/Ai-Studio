import React, { useState } from 'react';
import { UploadedAsset, BrandProfile, AspectRatio } from '../types';
import FileUpload from '../components/FileUpload';
import { generateCompositeImage } from '../services/geminiService';
import { Layers, Loader2, Download, FolderDown, ImagePlus, Settings2, Sliders } from 'lucide-react';

interface CompositionSuiteProps {
  brandProfile: BrandProfile | null;
  onDeductCredits: (amount: number) => void;
}

const CompositionSuite: React.FC<CompositionSuiteProps> = ({ brandProfile, onDeductCredits }) => {
  const [img1, setImg1] = useState<UploadedAsset | null>(null);
  const [img2, setImg2] = useState<UploadedAsset | null>(null);
  const [img3, setImg3] = useState<UploadedAsset | null>(null);
  const [ratio, setRatio] = useState<AspectRatio>('9:16');
  const [customPrompt, setCustomPrompt] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleMerge = async () => {
    const assets = [];
    if (img1) assets.push(img1);
    if (img2) assets.push(img2);
    if (img3) assets.push(img3);

    if (assets.length < 1) {
      alert("Please upload at least the product asset (@img1).");
      return;
    }

    setIsProcessing(true);
    setResults([]);
    onDeductCredits(10 * quantity); // Cost logic
    try {
      let promptInstruction = "Create a perfectly blended, photorealistic composition. Match lighting, shadows, and perspective seamlessly.";
      if (customPrompt) {
        promptInstruction += ` Scene Details: ${customPrompt}.`;
      }

      const urls = await generateCompositeImage(assets, promptInstruction, ratio, brandProfile, quantity);
      setResults(urls);
    } catch (e) {
      alert("Composition failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `Composition_Result_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    results.forEach((url, i) => {
      setTimeout(() => {
        handleDownload(url, i);
      }, i * 500);
    });
  };

  return (
    <div className="flex h-full bg-slate-950">
        {/* Config Sidebar */}
        <div className="w-[400px] bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto flex flex-col h-full">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="text-indigo-500" />
                    Composition
                </h2>
                <p className="text-slate-400 text-xs mt-1">Blend products into scenes seamlessly.</p>
            </div>

            <div className="space-y-6 flex-1">
                
                {/* Panel: Source Images */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <ImagePlus size={14} className="text-indigo-400"/> Source Images
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-1">
                             <FileUpload label="PRODUCT" tag="@img1" asset={img1} onUpload={setImg1} onRemove={() => setImg1(null)} variant="compact" />
                        </div>
                        <div className="col-span-1">
                             <FileUpload label="MODEL" tag="@img2" asset={img2} onUpload={setImg2} onRemove={() => setImg2(null)} variant="compact" />
                        </div>
                        <div className="col-span-2">
                             <FileUpload label="STYLE / EXTRA" tag="@img3" asset={img3} onUpload={setImg3} onRemove={() => setImg3(null)} variant="compact" />
                        </div>
                    </div>
                </div>

                {/* Panel: Composition Settings */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-4">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} className="text-indigo-400"/> Composition Settings
                    </h3>

                    {/* Prompt */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Prompt Instruction</label>
                        <textarea 
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="Example: @img2 holding @img1 naturally in a modern kitchen. Soft morning light, 8k resolution."
                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 text-xs focus:ring-1 focus:ring-indigo-500 outline-none h-24 resize-none placeholder:text-slate-600"
                        />
                         <p className="text-[9px] text-slate-500 mt-1 text-right">Use tags like @img1</p>
                    </div>

                    {/* Quantity Slider */}
                    <div>
                        <div className="flex justify-between mb-2">
                             <label className="block text-[10px] font-bold text-slate-500 uppercase">Number of Images</label>
                             <span className="text-xs font-bold text-indigo-400">{quantity}</span>
                        </div>
                        <div className="flex items-center gap-3">
                             <span className="text-[10px] text-slate-600 font-bold">1</span>
                             <input 
                                type="range" min="1" max="10" step="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <span className="text-[10px] text-slate-600 font-bold">10</span>
                        </div>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Aspect Ratio</label>
                        <div className="grid grid-cols-5 gap-1">
                            {['1:1', '3:4', '4:3', '16:9', '9:16'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRatio(r as AspectRatio)}
                                    className={`py-1.5 text-[9px] font-bold rounded border transition-all ${ratio === r ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <button 
                onClick={handleMerge}
                disabled={isProcessing || !img1}
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-900/20 flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : `Generate Batch (${quantity}0 Credits)`}
            </button>
        </div>

        {/* Results Gallery */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
            {results.length > 0 ? (
                <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 backdrop-blur-sm">
                        <h3 className="text-white font-bold text-sm flex items-center gap-2">
                            Result Gallery <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-xs">({results.length})</span>
                        </h3>
                        <div className="flex gap-2">
                             <button className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 flex items-center gap-1 transition-colors">
                                <Download size={12} /> Save One
                             </button>
                             <button 
                                onClick={handleDownloadAll}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"
                            >
                                <FolderDown size={12} /> Download All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min">
                        {results.map((url, idx) => (
                            <div key={idx} className="group relative bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className={`aspect-[${ratio.replace(':', '/')}] w-full relative`}>
                                     <img src={url} alt={`Composed ${idx}`} className="w-full h-full object-cover" />
                                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <div className="bg-indigo-500 text-white p-1 rounded-full shadow-lg">
                                             <Download size={12} />
                                         </div>
                                     </div>
                                </div>
                                <button 
                                    onClick={() => handleDownload(url, idx)}
                                    className="absolute inset-0 w-full h-full bg-transparent border-2 border-transparent hover:border-indigo-500/50 rounded-xl transition-all"
                                />
                                {/* Checked Indicator Simulation */}
                                <div className="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all shadow-lg">
                                    <Download size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 border-2 border-dashed border-slate-900 rounded-2xl bg-slate-900/20">
                    <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                        <Layers size={48} className="text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400">Composition Canvas</h3>
                    <p className="text-sm max-w-xs mt-2 text-slate-500">
                        Upload your Product and other assets to blend them into a unified scene.
                    </p>
                </div>
            )}
        </div>
    </div>
  );
};

export default CompositionSuite;
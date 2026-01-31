import React, { useState } from 'react';
import { UploadedAsset, StudioStyle, BrandProfile } from '../types';
import FileUpload from '../components/FileUpload';
import { generateStudioImage } from '../services/geminiService';
import { Camera, Loader2, Check, Download, ImagePlus } from 'lucide-react';

interface MasterMakerProps {
  brandProfile: BrandProfile | null;
  onDeductCredits: (amount: number) => void;
}

const styles = Object.values(StudioStyle);

const MasterMaker: React.FC<MasterMakerProps> = ({ brandProfile, onDeductCredits }) => {
  const [product, setProduct] = useState<UploadedAsset | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StudioStyle>(StudioStyle.CleanBright);
  const [quantity, setQuantity] = useState<number>(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!product) return;
    setIsProcessing(true);
    setResults([]);
    onDeductCredits(8 * quantity); // Cost per image
    try {
      const urls = await generateStudioImage(product.base64, selectedStyle, '1:1', brandProfile, quantity);
      setResults(urls);
    } catch (e) {
      alert("Generation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `Master_Studio_${product?.file.name.split('.')[0]}_Var${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full">
      <div className="w-[400px] bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto">
        <div className="mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Camera className="text-indigo-500" />
                Master Maker
            </h2>
            <p className="text-slate-400 text-sm mt-1">3-click professional studio photos.</p>
        </div>

        <div className="space-y-6">
            <FileUpload label="Raw Product Photo" tag="@img1" asset={product} onUpload={setProduct} onRemove={() => setProduct(null)} />
            
            <div>
                <label className="block text-sm text-slate-400 mb-3">Select Studio Style</label>
                <div className="grid grid-cols-2 gap-2">
                    {styles.map(style => (
                        <button
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                            className={`p-3 rounded-lg border text-left transition-all ${selectedStyle === style ? 'bg-indigo-900/40 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold block">{style}</span>
                                {selectedStyle === style && <Check size={14} className="text-indigo-400" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm text-slate-400 mb-2">Quantity</label>
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    {[1, 2, 3].map(n => (
                         <button
                            key={n}
                            onClick={() => setQuantity(n)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${quantity === n ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            {n} Result{n > 1 ? 's' : ''}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={!product || isProcessing}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-900/20 flex justify-center items-center gap-2"
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : `Generate Master File (${8 * quantity} Cr)`}
            </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <ImagePlus size={18} className="text-indigo-400"/>
                Generation Gallery
            </h3>
            
            {results.length > 0 ? (
                <div className="grid grid-cols-2 gap-8">
                    {results.map((url, idx) => (
                        <div key={idx} className="space-y-3 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 150}ms` }}>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Variation {idx + 1}</span>
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">1:1 Ratio</span>
                            </div>
                            <div className="aspect-square bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative group">
                                <img src={url} className="w-full h-full object-cover" alt={`Result ${idx}`} />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                                    <button 
                                        onClick={() => handleDownload(url, idx)}
                                        className="bg-white hover:bg-slate-200 text-black px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                     <div className="bg-slate-800 p-4 rounded-full mb-4 opacity-50">
                        <Camera size={48} className="text-slate-500" />
                     </div>
                    <p className="text-slate-400 font-medium text-lg">Ready to Generate</p>
                    <p className="text-slate-600 text-sm mt-1">Upload a product and select a style to begin</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MasterMaker;
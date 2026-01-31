import React, { useState } from 'react';
import { UploadedAsset, BrandProfile } from '../types';
import FileUpload from '../components/FileUpload';
import { generateCreativePrompt, generateCompositeImage, analyzeProductDetails, generateBulkVariations } from '../services/geminiService';
import { Loader2, Wand2, Sparkles, Image as ImageIcon, BrainCircuit, FileText, Download, Copy, Table, User, LayoutTemplate } from 'lucide-react';

interface CreativeSuiteProps {
  brandProfile: BrandProfile | null;
  onDeductCredits: (amount: number) => void;
}

const CreativeSuite: React.FC<CreativeSuiteProps> = ({ brandProfile, onDeductCredits }) => {
  const [img1, setImg1] = useState<UploadedAsset | null>(null);
  const [img2, setImg2] = useState<UploadedAsset | null>(null);
  const [manualProductDetails, setManualProductDetails] = useState('');
  
  // Photo Configuration
  const [mood, setMood] = useState('Cinematic Luxury');
  const [selectedPose, setSelectedPose] = useState('Smart Adaptive (Product Contextual)');
  const [modelType, setModelType] = useState('Auto-Detect based on Product');
  const [selectedBackground, setSelectedBackground] = useState('Studio Plain');
  
  // Results
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Loading States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [productAnalysis, setProductAnalysis] = useState<{description: string, usp: string, productCategory: string, targetGender: string} | null>(null);
  
  // Bulk States
  const [showBulkOption, setShowBulkOption] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(10);
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);

  // Libraries
  const flexiblePoses = [
    "Smart Adaptive (Product Contextual)",
    "Product in Use (Action Shot)",
    "Lifestyle Natural Interaction",
    "Close-up Product Focus",
    "Holding product elegantly",
    "Applying product / Touching face",
    "Walking / Dynamic Movement",
    "Sitting / Relaxed Pose",
    "Product on Table (No Model)"
  ];

  const modelTypes = [
    "Auto-Detect based on Product",
    "Female Model",
    "Male Model",
    "Androgynous/Neutral",
    "Couple / Pair"
  ];

  const backgrounds = [
    "Studio Plain",
    "Luxury Bathroom",
    "Pharmacy/Medical",
    "Living Room",
    "Outdoor Nature", 
    "Urban City"
  ];

  const moods = [
    "Cinematic Luxury",
    "Golden Hour",
    "Professional Medical",
    "Studio Minimalist",
    "Urban Streetwear",
    "Fresh & Airy",
    "High Energy / Sport"
  ];

  const handleAnalyze = async () => {
    if (!img1) return;
    setIsAnalyzing(true);
    onDeductCredits(2); // Analysis cost
    try {
      const data = await analyzeProductDetails(img1.base64);
      setProductAnalysis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCombinedProductDescription = () => {
    let desc = "";
    if (img1) {
        desc += `Product Name: "${img1.file.name.split('.')[0]}". `;
    }
    if (manualProductDetails) {
        desc += `Manual Details: ${manualProductDetails}. `;
    }
    if (productAnalysis?.description) {
        desc += `Visual Analysis: ${productAnalysis.description}.`;
    }
    return desc || "Generic product";
  };

  const handleGeneratePrompt = async () => {
    onDeductCredits(1); // Prompt gen cost
    let currentAnalysis = productAnalysis;
    if (!currentAnalysis && img1) {
        setIsAnalyzing(true);
        try {
            currentAnalysis = await analyzeProductDetails(img1.base64);
            setProductAnalysis(currentAnalysis);
            onDeductCredits(2); // Extra for implicit analysis
        } catch(e) { console.error(e); }
        setIsAnalyzing(false);
    }
    
    setIsGenerating(true);
    setGeneratedPrompt(''); 
    setShowBulkOption(false);

    try {
      const prodDesc = getCombinedProductDescription();
      
      const prompt = await generateCreativePrompt(
        prodDesc,
        modelType,
        mood,
        selectedPose,
        selectedBackground,
        brandProfile,
        currentAnalysis
      );
      setGeneratedPrompt(prompt);
      setGeneratedImage(null); 
      setShowBulkOption(true); 
    } catch (error) {
      alert("Failed to generate prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVisual = async () => {
    if (!img1 || !generatedPrompt) return;
    setIsGenerating(true);
    onDeductCredits(5); // Image gen cost
    try {
      const assets = [{ base64: img1.base64, tag: img1.tag }];
      if (img2) assets.push({ base64: img2.base64, tag: img2.tag });

      const resultUrl = await generateCompositeImage(assets, generatedPrompt, '1:1', brandProfile, 1);
      setGeneratedImage(resultUrl[0]);
    } catch (error) {
      alert("Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkGeneration = async () => {
    setIsGeneratingBulk(true);
    onDeductCredits(bulkQuantity * 0.5); // Bulk discount rate
    try {
        const prodDesc = getCombinedProductDescription();
        const modelDesc = img2 ? "A professional model" : "No model";
        const productName = img1?.file.name.split('.')[0] || "Product_X";

        const results = await generateBulkVariations(
            'photo',
            bulkQuantity,
            {
                productDescription: prodDesc,
                modelDescription: modelDesc,
                mood,
                pose: selectedPose,
                usp: productAnalysis?.usp || "Great product"
            },
            brandProfile
        );

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Product Name,Prompt (Variations)\n";
        results.forEach((item: any) => {
            const safePrompt = item.prompt.replace(/"/g, '""');
            csvContent += `"${productName}","${safePrompt}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Creative_Prompts_Bulk_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (e) {
        console.error(e);
        alert("Bulk generation failed. Try a smaller quantity.");
    } finally {
        setIsGeneratingBulk(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Config Panel */}
      <div className="w-[450px] bg-slate-900 border-r border-slate-800 flex flex-col h-full">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Sparkles className="text-indigo-500" />
            Creative Suite (Photo)
          </h2>
          <p className="text-xs text-slate-400">Generate high-quality single advertising images.</p>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Ad-Intelligence Section */}
          <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <BrainCircuit size={14} /> Ad-Intelligence
                 </h3>
                 {img1 && !productAnalysis && (
                    <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="text-xs text-indigo-300 underline hover:text-white"
                    >
                        {isAnalyzing ? "Analyzing... (2Cr)" : "Auto-Detecting... (2Cr)"}
                    </button>
                 )}
              </div>
              
              {!img1 && !manualProductDetails ? (
                  <p className="text-slate-500 text-xs italic">Upload product to enable Auto-Adaptation</p>
              ) : (
                  <div className="space-y-2">
                      {productAnalysis && (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                                <span className="text-slate-500 text-[9px] uppercase block">Category</span>
                                <span className="text-indigo-300 text-xs font-bold">{productAnalysis.productCategory}</span>
                            </div>
                            <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                                <span className="text-slate-500 text-[9px] uppercase block">Gender Context</span>
                                <span className="text-pink-300 text-xs font-bold">{productAnalysis.targetGender}</span>
                            </div>
                        </div>
                      )}
                      {manualProductDetails && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase">Manual Input</span>
                          <p className="text-slate-300 text-xs line-clamp-2">{manualProductDetails}</p>
                        </div>
                      )}
                  </div>
              )}
          </div>

          {/* Assets */}
          <div className="space-y-4">
             <FileUpload 
               label="Master Product Image" 
               tag="@img1" 
               asset={img1} 
               onUpload={(a) => { setImg1(a); setProductAnalysis(null); }} 
               onRemove={() => setImg1(null)} 
             />
             
             <div>
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <FileText size={14} className="text-slate-400"/> Product Details (Manual)
                    </span>
                 </div>
                 <textarea
                    value={manualProductDetails}
                    onChange={(e) => setManualProductDetails(e.target.value)}
                    placeholder="E.g. Botol serum warna biru, tekstur cair, label emas. Fokus pada kemampuan melembabkan."
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none min-h-[60px]"
                 />
             </div>

             <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-300">Specific Model (Optional) <span className="text-indigo-400 font-mono text-xs">@img2</span></span>
                    {img2 && <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Variable Asset</span>}
                </div>
                <FileUpload 
                   label="" 
                   tag="@img2" 
                   asset={img2} 
                   onUpload={setImg2} 
                   onRemove={() => setImg2(null)} 
                />
             </div>
          </div>

          {/* Configuration Controls */}
          <div className="space-y-5 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Atmosphere / Mood</label>
              <select 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {moods.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-2">
                        <User size={12}/> Model Context / Gender
                    </label>
                    <select 
                        value={modelType}
                        onChange={(e) => setModelType(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        {modelTypes.map(p => <option key={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Smart Template / Action</label>
                    <select 
                        value={selectedPose}
                        onChange={(e) => setSelectedPose(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        {flexiblePoses.map(p => <option key={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Background (Setting)</label>
                <div className="grid grid-cols-2 gap-2">
                    {backgrounds.map(bg => (
                        <button
                            key={bg}
                            onClick={() => setSelectedBackground(bg)}
                            className={`px-3 py-2 text-xs rounded border text-left transition-all ${selectedBackground === bg ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                        >
                            {bg}
                        </button>
                    ))}
                </div>
            </div>

            <button 
              onClick={handleGeneratePrompt}
              disabled={isGenerating || (!img1 && !manualProductDetails)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
              Generate Smart Prompt (1 Cr)
            </button>
          </div>
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
             {generatedPrompt ? (
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Primary Result */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-white">Generated Prompt (Adaptive)</h3>
                            <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20 font-mono">
                                {modelType === 'Auto-Detect based on Product' ? 'Auto-Styled' : 'Custom Model'}
                            </span>
                        </div>
                        <p className="text-slate-300 font-mono text-sm leading-relaxed p-4 bg-black/30 rounded-lg border border-slate-800">
                            {generatedPrompt}
                        </p>
                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={handleGenerateVisual}
                                disabled={isGenerating}
                                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600 flex items-center gap-2"
                            >
                               {isGenerating ? <Loader2 className="animate-spin h-4 w-4"/> : <ImageIcon size={16} />}
                               Visualize Output (5 Cr)
                            </button>
                        </div>
                    </div>
    
                    {generatedImage && (
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-lg font-semibold text-white mb-4">Visual Output</h3>
                            <div className="aspect-square w-full bg-black rounded-lg overflow-hidden border border-slate-800">
                                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    )}

                    {/* Bulk Generation Option */}
                    {showBulkOption && (
                        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 animate-in slide-in-from-bottom-2">
                             <div className="flex items-start gap-4">
                                <div className="bg-indigo-600 p-3 rounded-lg">
                                    <Copy size={24} className="text-white"/>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">Scale Production (Bulk Mode)</h3>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Like this result? Generate mass variations in CSV/Excel. 
                                        The AI will keep the pose "{selectedPose}" but vary the background and lighting.
                                    </p>
                                    
                                    <div className="flex items-end gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Quantity</label>
                                            <select 
                                                value={bulkQuantity}
                                                onChange={(e) => setBulkQuantity(Number(e.target.value))}
                                                className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white w-32"
                                            >
                                                <option value={10}>10 Variations</option>
                                                <option value={20}>20 Variations</option>
                                                <option value={50}>50 Variations</option>
                                                <option value={100}>100 Variations</option>
                                            </select>
                                        </div>
                                        <button 
                                            onClick={handleBulkGeneration}
                                            disabled={isGeneratingBulk}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {isGeneratingBulk ? <Loader2 className="animate-spin" size={18}/> : <Download size={18}/>}
                                            Download .CSV
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-indigo-400 mt-2 flex items-center gap-1">
                                        <Table size={12}/> Format: Column 1: Product Name, Column 2: Prompt
                                    </p>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                    <div className="bg-slate-900 p-6 rounded-full mb-4">
                        <LayoutTemplate size={48} className="opacity-20" />
                    </div>
                    <p className="text-lg font-medium">Smart Adaptive Workspace</p>
                    <p className="text-sm">AI auto-detects product type to style the perfect model</p>
                </div>
            )
        }
      </div>
    </div>
  );
};

export default CreativeSuite;
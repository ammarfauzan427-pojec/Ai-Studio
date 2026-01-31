import React, { useState } from 'react';
import { UploadedAsset, BrandProfile, AspectRatio, VideoGenerationScene, GeneratedVideoResult } from '../types';
import FileUpload from '../components/FileUpload';
import { generateVeoVideo } from '../services/geminiService';
import { Loader2, Clapperboard, Plus, X, Video, AlertCircle, Key } from 'lucide-react';

interface VideoStoryboardProps {
  brandProfile: BrandProfile | null;
}

const VideoStoryboard: React.FC<VideoStoryboardProps> = ({ brandProfile }) => {
  // State for Scene Inputs
  const [scenes, setScenes] = useState<VideoGenerationScene[]>([
    { id: '1', image: null, motionPrompt: '' }
  ]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  
  // State for Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideoResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to manage scenes
  const addScene = () => {
    if (scenes.length >= 5) return; // Limit to 5 for now
    setScenes([...scenes, { id: Date.now().toString(), image: null, motionPrompt: '' }]);
  };

  const removeScene = (id: string) => {
    if (scenes.length <= 1) return; // Keep at least one
    setScenes(scenes.filter(s => s.id !== id));
  };

  const updateScene = (id: string, field: 'image' | 'motionPrompt', value: any) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // API Key Check for Veo
  const checkApiKey = async (): Promise<boolean> => {
    // Casting window to any to access aistudio
    const aistudio = (window as any).aistudio;
    if (aistudio) {
        try {
            const hasKey = await aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await aistudio.openSelectKey();
                return true; // Assume success/retry logic handles it
            }
            return true;
        } catch (e) {
            console.error("Key selection error", e);
            return false;
        }
    }
    return true; // Fallback if not in specific environment
  };

  const handleGenerate = async () => {
    setErrorMsg(null);

    // Validate inputs
    const validScenes = scenes.filter(s => s.image !== null);
    if (validScenes.length === 0) {
        alert("Please upload an image for at least one scene.");
        return;
    }

    // Step 1: Ensure API Key
    const keyReady = await checkApiKey();
    if (!keyReady) return;

    setIsGenerating(true);
    setGeneratedVideos(validScenes.map(s => ({ sceneId: s.id, videoUrl: '', status: 'generating' })));

    try {
        // We process sequentially or parallel depending on need. Veo can be slow, parallel is risky for rate limits but faster.
        // Let's do parallel with individual error handling.
        
        const promises = validScenes.map(async (scene) => {
             if (!scene.image) return;
             
             try {
                 // Construct prompt: Motion + Brand Profile context
                 let finalPrompt = scene.motionPrompt || "Cinematic movement, high quality.";
                 if (brandProfile) {
                     finalPrompt += ` Style: ${brandProfile.style}, Tone: ${brandProfile.tone}.`;
                 }

                 const videoUrl = await generateVeoVideo(scene.image.base64, finalPrompt, aspectRatio);
                 
                 setGeneratedVideos(prev => prev.map(v => 
                     v.sceneId === scene.id 
                     ? { ...v, videoUrl: videoUrl || '', status: videoUrl ? 'completed' : 'failed' } 
                     : v
                 ));

             } catch (e: any) {
                 console.error(`Failed scene ${scene.id}`, e);
                 // If specific API key error
                 if (e.message && e.message.includes("Requested entity was not found")) {
                      setErrorMsg("API Key invalid or not selected properly. Please try again.");
                      // Reset key if possible
                      const aistudio = (window as any).aistudio;
                      if (aistudio) await aistudio.openSelectKey();
                 }

                 setGeneratedVideos(prev => prev.map(v => 
                    v.sceneId === scene.id ? { ...v, status: 'failed' } : v
                ));
             }
        });

        await Promise.all(promises);

    } catch (e) {
        console.error("Global generation error", e);
        setErrorMsg("An unexpected error occurred during generation.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-950 text-slate-100 font-sans">
      {/* Left Panel: Scene Builder */}
      <div className="w-[450px] bg-slate-900 border-r border-slate-800 flex flex-col h-full z-10 shadow-xl">
         <div className="p-6 border-b border-slate-800">
             <h2 className="text-xl font-bold text-green-400 flex items-center gap-2 mb-2 tracking-wide">
                 Video Storyboard v3
             </h2>
             <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <p className="text-xs text-slate-400">
                    Upload a sequence of images. AI (Veo) will generate motion based on prompts for each scene.
                </p>
             </div>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {scenes.map((scene, index) => (
                 <div key={scene.id} className="group relative border border-slate-700 rounded-xl bg-slate-950 p-4 transition-all hover:border-green-500/50">
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-green-500 font-bold text-lg font-mono">{(index + 1).toString().padStart(2, '0')}</span>
                          <div className="flex items-center gap-2">
                              {scenes.length > 1 && (
                                  <button onClick={() => removeScene(scene.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                                      <X size={16}/>
                                  </button>
                              )}
                          </div>
                      </div>

                      {/* Image Upload Area */}
                      <div className="mb-4">
                          <FileUpload 
                             label="CLICK TO UPLOAD IMAGE" 
                             tag="@img1" // Generic tag for internal use
                             asset={scene.image}
                             onUpload={(a) => updateScene(scene.id, 'image', a)}
                             onRemove={() => updateScene(scene.id, 'image', null)}
                             variant="compact"
                          />
                      </div>

                      {/* Motion Prompt */}
                      <div>
                          <label className="block text-[10px] font-bold text-green-500/80 mb-1 uppercase tracking-wider">Motion Prompt</label>
                          <textarea 
                             value={scene.motionPrompt}
                             onChange={(e) => updateScene(scene.id, 'motionPrompt', e.target.value)}
                             placeholder="Describe the motion for this scene..."
                             className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg p-3 h-20 resize-none focus:ring-1 focus:ring-green-500 outline-none placeholder:text-slate-600"
                          />
                      </div>
                 </div>
             ))}

             <button 
                onClick={addScene}
                className="w-full py-3 border border-dashed border-slate-700 hover:border-green-500 text-slate-500 hover:text-green-400 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
             >
                <Plus size={16} /> Add Scene
             </button>
         </div>

         {/* Bottom Controls */}
         <div className="p-6 bg-slate-900 border-t border-slate-800">
             <div className="mb-4">
                 <label className="block text-[10px] font-bold text-green-500 mb-2 uppercase">Aspect Ratio</label>
                 <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                     {['1:1', '9:16', '16:9'].map(r => (
                         <button
                            key={r}
                            onClick={() => setAspectRatio(r as AspectRatio)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${aspectRatio === r ? 'bg-green-600 text-black' : 'text-slate-500 hover:text-slate-300'}`}
                         >
                             {r}
                         </button>
                     ))}
                 </div>
             </div>

             <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-transparent border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate'}
             </button>
             {errorMsg && (
                 <p className="mt-2 text-red-400 text-xs text-center flex items-center justify-center gap-1">
                     <AlertCircle size={12}/> {errorMsg}
                 </p>
             )}
         </div>
      </div>

      {/* Right Panel: Generated Assets */}
      <div className="flex-1 bg-black p-8 overflow-y-auto relative">
         <h3 className="text-green-400 font-bold text-sm mb-6 uppercase tracking-wider">Generated Assets</h3>
         
         {generatedVideos.length === 0 ? (
             <div className="h-[80%] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-700">
                 <Clapperboard size={64} className="opacity-20 mb-4 text-green-900"/>
                 <p className="text-slate-600 font-mono text-sm">
                     <span className="bg-blue-900/30 text-blue-400 px-1">Your</span> generated assets will appear here.
                 </p>
             </div>
         ) : (
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                 {generatedVideos.map((video, idx) => (
                     <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                         <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                             <span className="text-xs text-slate-500 font-mono">SCENE {String(idx + 1).padStart(2, '0')}</span>
                             {video.status === 'completed' && <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-900/50">READY</span>}
                             {video.status === 'failed' && <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-0.5 rounded">FAILED</span>}
                         </div>
                         
                         <div className={`aspect-[${aspectRatio.replace(':', '/')}] bg-black relative flex items-center justify-center`}>
                             {video.status === 'generating' ? (
                                 <div className="text-center">
                                     <Loader2 size={32} className="animate-spin text-green-500 mx-auto mb-2"/>
                                     <p className="text-xs text-green-500/70 font-mono animate-pulse">RENDERING PIXELS...</p>
                                 </div>
                             ) : video.status === 'completed' ? (
                                 <video 
                                    src={video.videoUrl} 
                                    controls 
                                    autoPlay 
                                    loop 
                                    className="w-full h-full object-cover"
                                 />
                             ) : (
                                 <div className="text-center text-slate-600">
                                     <AlertCircle size={32} className="mx-auto mb-2 text-red-900"/>
                                     <p className="text-xs">Generation Failed</p>
                                 </div>
                             )}
                         </div>
                     </div>
                 ))}
             </div>
         )}
         
         {/* Background Grid Decoration */}
         <div className="absolute inset-0 pointer-events-none opacity-5" 
              style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>
      </div>
    </div>
  );
};

export default VideoStoryboard;
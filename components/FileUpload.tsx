import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { UploadedAsset } from '../types';

interface FileUploadProps {
  label: string;
  tag: '@img1' | '@img2' | '@img3';
  asset: UploadedAsset | null;
  onUpload: (asset: UploadedAsset) => void;
  onRemove: () => void;
  accept?: string;
  variant?: 'default' | 'compact';
}

const FileUpload: React.FC<FileUploadProps> = ({ label, tag, asset, onUpload, onRemove, accept = "image/*", variant = 'default' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const heightClass = variant === 'compact' ? 'h-32' : 'h-48';
  const iconSize = variant === 'compact' ? 16 : 20;
  const textSize = variant === 'compact' ? 'text-xs' : 'text-sm';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload({
          id: Math.random().toString(36).substr(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
          base64: reader.result as string,
          type: tag === '@img1' ? 'product' : 'model',
          tag
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className={`font-medium text-slate-300 ${textSize}`}>{label} <span className="text-indigo-400 font-mono text-[10px]">{tag}</span></span>
      </div>
      
      {asset ? (
        <div className={`relative group border border-slate-700 rounded-lg overflow-hidden ${heightClass} bg-slate-900`}>
          <img src={asset.previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          <button 
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm transition-colors"
          >
            <X size={12} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-2">
             <p className="text-[10px] text-white truncate px-1">{asset.file.name}</p>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          className={`${heightClass} border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/50 hover:bg-slate-800 hover:border-indigo-500/50 flex flex-col items-center justify-center cursor-pointer transition-all group`}
        >
          <div className={`bg-slate-700 group-hover:bg-slate-600 p-2 rounded-full mb-2 transition-colors`}>
            <Upload size={iconSize} className="text-slate-400 group-hover:text-indigo-400" />
          </div>
          <p className={`${textSize} text-slate-400 font-medium`}>Click to upload</p>
          <input 
            type="file" 
            ref={inputRef} 
            onChange={handleFileChange} 
            accept={accept} 
            className="hidden" 
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
import { X } from 'lucide-react';

export default function ImagePreviewModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/98 backdrop-blur-xl"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-4 bg-zinc-900 hover:bg-rose-600 rounded-2xl transition-all text-zinc-400 hover:text-white"
      >
        <X size={24} />
      </button>
      <img 
        src={imageUrl} 
        alt="Preview" 
        className="max-w-[90vw] max-h-[90vh] rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
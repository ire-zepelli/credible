import { useState } from 'react';

export default function DenialModal({ isOpen, onClose, onSubmit }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/98 backdrop-blur-md">
      <div className="bg-[#111111] border border-rose-500/30 w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-3xl font-bold text-white tracking-tighter mb-2">
          Denial Reason
        </h3>
        <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.3em] mb-8">
          Official Statement Required
        </p>
        
        <textarea
          autoFocus
          className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-6 text-white focus:outline-none focus:border-rose-500 min-h-[180px] transition-all text-lg font-bold tracking-tight resize-none"
          placeholder="Provide justification..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        
        <div className="flex gap-4 mt-10">
          <button 
            onClick={handleClose}
            className="flex-1 py-4 text-zinc-500 font-black uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!reason.trim()}
            className="flex-[2] py-4 bg-rose-600 text-white font-black rounded-xl text-sm uppercase tracking-widest disabled:opacity-20"
          >
            Confirm Denial
          </button>
        </div>
      </div>
    </div>
  );
}
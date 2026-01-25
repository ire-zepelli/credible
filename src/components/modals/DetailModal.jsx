import { useState } from "react";
import { X, User, Hash, Calendar, Package } from "lucide-react";
import ImagePreviewModal from "./ImagePreviewModal";

export default function DetailModal({
  item,
  onClose,
  onApprove,
  onDeny,
  loading = false,
}) {
  const [activeImage, setActiveImage] = useState(null);
  if (!item) return null;

  const resolveStatus = () => {
    if (item.status === "pending" || item.is_confirmed === false)
      return "pending";
    if (item.status === "approved" || item.is_confirmed === true)
      return "approved";
    if (item.status === "denied" || item.denyMessage) return "denied";
    return "pending";
  };
  const status = resolveStatus();
  const files = item.files || [];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
        <div className="bg-[#111111] border border-zinc-800 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-300">
          {/* HEADER */}
          <div className="px-12 py-10 border-b border-zinc-800 flex justify-between items-center bg-[#161616]">
            <div>
              <span className="text-[#FFB800] text-[10px] font-black uppercase tracking-[0.3em] bg-[#FFB800]/10 px-4 py-1.5 rounded-full">
                System Audit
              </span>
              <h3 className="mt-4 text-4xl font-bold tracking-tighter text-white">
                Reviewing {item.type?.slice(0, -1)}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-4 transition-all bg-zinc-900 hover:bg-rose-600 rounded-2xl text-zinc-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 p-12 space-y-10 overflow-y-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="p-8 bg-zinc-900/50 rounded-[2rem] border border-zinc-800/50">
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-4">
                  Subject Identity
                </p>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-800 flex items-center justify-center text-[#FFB800] border border-zinc-700 shadow-inner">
                    <User size={32} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-white">
                      {item.name || "No Name"}
                    </p>
                    <p className="text-base font-bold text-zinc-500">
                      {item.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-900/50 rounded-[2rem] border border-zinc-800/50">
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-4">
                  Registry Reference
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold tracking-tighter text-white">
                      #{String(item.id).padStart(6, "0")}
                    </p>
                    <p className="mt-1 text-sm font-bold tracking-widest uppercase text-zinc-500">
                      Global UID
                    </p>
                  </div>
                  <Hash size={32} className="text-zinc-800" />
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">
                  Visual Evidence
                </h4>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {files.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group"
                      onClick={() => setActiveImage(url)}
                    >
                      <div className="aspect-[16/10] bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-800 cursor-zoom-in transition-all group-hover:border-[#FFB800] shadow-2xl">
                        <img
                          src={url}
                          className="object-cover w-full h-full transition-all duration-700 grayscale group-hover:grayscale-0"
                          alt={`Evidence ${idx + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-10 bg-[#161616] border-t border-zinc-800 flex gap-6">
            {status === "pending" ? (
              <>
                <button
                  onClick={onApprove}
                  disabled={loading}
                  className="flex-1 py-6 bg-[#FFB800] hover:bg-white text-black font-black text-xl rounded-2xl transition-all tracking-tight uppercase disabled:opacity-50"
                >
                  {loading ? "Approving..." : "Approve Record"}
                </button>
                <button
                  onClick={onDeny}
                  className="flex-1 py-6 text-xl font-black tracking-tight uppercase transition-all border-2 border-rose-600/50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl"
                >
                  Reject
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-6 text-xl font-black tracking-widest uppercase bg-zinc-800 text-zinc-500 rounded-2xl"
              >
                Close Archive
              </button>
            )}
          </div>
        </div>
      </div>

      <ImagePreviewModal
        imageUrl={activeImage}
        onClose={() => setActiveImage(null)}
      />
    </>
  );
}

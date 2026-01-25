import { User } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export default function TableRow({ item, onInspect }) {
  return (
    <tr className="hover:bg-white/[0.05] transition-colors group">
      <td className="px-8 py-7">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:border-[#FFB800]/50 group-hover:text-[#FFB800] transition-all">
            <User size={20} />
          </div>
          <div>
            <div className="text-lg font-bold leading-tight tracking-tight text-zinc-100">
              {item.name || "No Name"}
            </div>
            <div className="mt-1 text-xs font-bold text-zinc-500">
              {item.email || `REF: ${item.id || "N/A"}`}
            </div>
          </div>
        </div>
      </td>

      <td className="px-8 py-7">
        <div className="text-base font-bold tracking-tight text-zinc-300">
          {item.title || "Transaction"}
        </div>
        <div className="text-[10px] text-zinc-600 mt-1 font-black uppercase tracking-widest">
          UID-{item.id || "N/A"}
        </div>
      </td>

      <td className="px-8 py-7">
        <StatusBadge status={item.status || "pending"} />
      </td>

      <td className="px-8 text-right py-7">
        <button
          onClick={onInspect}
          className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black rounded-xl text-xs font-black tracking-widest uppercase transition-all"
        >
          Inspect
        </button>
      </td>
    </tr>
  );
}

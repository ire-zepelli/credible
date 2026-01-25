import { Menu, X, Search } from "lucide-react";
import { COOLVETICA_FONT } from "../../utils/constants";

export default function Header({
  isSidebarOpen,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
}) {
  return (
    <header
      style={COOLVETICA_FONT}
      className="px-10 py-3 flex justify-between items-center bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-zinc-800/50 z-10"
    >
      <button
        onClick={onToggleSidebar}
        className="p-2 transition-colors rounded-lg hover:bg-zinc-800 text-zinc-400"
      >
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className="relative w-full max-w-lg mx-8">
        <Search
          className="absolute -translate-y-1/2 left-4 top-1/2 text-zinc-500"
          size={16}
        />
        <input
          type="text"
          placeholder="Search registry..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] outline-none transition-all placeholder:text-zinc-600 font-bold"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 text-xs font-bold border rounded-full bg-zinc-800 border-zinc-700">
          AD
        </div>
      </div>
    </header>
  );
}

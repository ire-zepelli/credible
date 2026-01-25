export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="p-8 bg-zinc-900/50 rounded-[2rem] border border-zinc-800/50">
      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-4">
        {label}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tighter text-white">
            {value}
          </p>
        </div>
        {Icon && <Icon size={32} className="text-zinc-800" />}
      </div>
    </div>
  );
}

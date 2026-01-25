import TableRow from "./TableRow";

export default function DataTable({ data, onInspect }) {
  return (
    <div className="rounded-[2rem] border border-zinc-800/50 bg-[#111111] overflow-hidden shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#161616] text-zinc-600 text-[10px] uppercase font-black tracking-[0.3em]">
          <tr>
            <th className="px-8 py-6">Submitter Information</th>
            <th className="px-8 py-6">Reference Details</th>
            <th className="px-8 py-6">Status</th>
            <th className="px-8 py-6 text-right">Verification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/30">
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center text-white">
                No items found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                onInspect={() => onInspect(item)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import { STATUS_STYLES } from '../../utils/constants';

export default function StatusBadge({ status }) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${STATUS_STYLES[status]}`}>
      {status.toUpperCase()}
    </div>
  );
}
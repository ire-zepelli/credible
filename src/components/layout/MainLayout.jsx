import { COOLVETICA_FONT } from '../../utils/constants';

export default function MainLayout({ children }) {
  return (
    <div 
      style={COOLVETICA_FONT} 
      className="flex h-screen bg-[#0A0A0A] text-zinc-100 selection:bg-[#FFB800] selection:text-black antialiased"
    >
      {children}
    </div>
  );
}
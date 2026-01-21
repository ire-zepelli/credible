import React from "react";

export default function BrokerActivityCard() {
  return (
    <div className="flex flex-col items-start justify-start flex-1 gap-10 bg-black/40">
      <header className="flex items-center w-full h-10 px-6 pt-8 pb-4 text-white border-b justfity-center border-white/20">
        <h1 className="leading-none text-white/60">ACTIVITY FEED</h1>
      </header>
      <div className="flex items-center w-full px-6 pt-8 pb-4 text-white border-b h-[4rem] justfity-center border-white/20"></div>
      <div className="flex items-center w-full px-6 pt-8 pb-4 text-white border-b h-[4rem] justfity-center border-white/20"></div>
      <div className="flex items-center w-full px-6 pt-8 pb-4 text-white border-b h-[4rem] justfity-center border-white/20"></div>
    </div>
  );
}

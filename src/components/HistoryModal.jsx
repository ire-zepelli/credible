import React from "react";

export default function HistoryModal() {
  return (
    <div className="fixed top-0 left-0 z-20 w-screen h-screen bg-black/20 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2B2B2B] text-black w-[40rem] h-fit p-8 flex flex-col backdrop-blur-sm"></div>
    </div>
  );
}

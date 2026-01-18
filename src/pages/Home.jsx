import React from "react";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center opacity-[.10] z-0">
        <p className="text-[#F2AF0D] text-[6rem] font-bold mb-[-12rem] ml-[-50rem]">
          never trust claims
        </p>
        <h1 className="text-[#F2AF0D] text-[30rem] font-black">Credible</h1>
        <p className="text-[#F2AF0D] text-[6rem] font-bold mt-[-12rem] mr-[-50rem]">
          verify credibility
        </p>
      </div>

      {/* Header
      <header className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-20">
      <h1 className="text-[#F2AF0D] text-4xl">Credible</h1>
      </header> */}

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center w-full h-full gap-3">
        <h1 className="text-[#F2AF0D] text-[6rem] font-bold">can i trust</h1>
        <input
          type="text"
          placeholder="broker id | name"
          className="text-[5rem] text-[#FFFF] font-bold border-b-[5px] border-[#F2AF0D] bg-transparent focus:outline-none text-center w-[50rem]"
        />
        <h1
          className="text-[#F2AF0D] text-[6rem] font-bold"
          onClick={() => (window.location.href = "/broker/1")}
        >
          ?
        </h1>
      </main>
    </div>
  );
}

import { Link } from "react-router-dom";
import React from "react";

export default function ConnectWallet() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center opacity-[.10] z-0">
        <p className="text-[#F2AF0D] text-[6rem] font-bold mb-[-12rem] ml-[-50rem]">
          never trust claims
        </p>
        <h1 className="text-[#F2AF0D] text-[30rem] font-black">CREDIBLE</h1>
        <p className="text-[#F2AF0D] text-[6rem] font-bold mt-[-12rem] mr-[-50rem]">
          verify credibility
        </p>
      </div>

      {/* Header
      <header className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-20">
      <h1 className="text-[#F2AF0D] text-4xl">Credible</h1>
      </header> */}

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-3">
        <h1 className="text-[#F2AF0D] text-[6rem] font-bold">Credible</h1>
        <button className="px-3 py-1 text-white bg-[#F2AF0D] rounded-xl text-2xl">
          Connect
        </button>
      </main>
      <Link to="/" className="absolute z-10 text-white bottom-10 right-10">
        Return to Home
      </Link>
    </div>
  );
}

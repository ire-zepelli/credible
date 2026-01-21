import React from "react";

export default function BrokerPreview() {
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

      {/* Header */}
      <header className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-20">
        <h1 className="text-[#F2AF0D] text-4xl">Credible</h1>
      </header>

      {/* Main content */}
      <main className="relative z-10 w-full h-full flex justify-start items-center gap-3 pt-[10rem] flex-col">
        <h1 className="text-[#F2AF0D] text-[4rem] font-bold">
          can i trust JOHN DOE ?
        </h1>

        {/* Preview */}
        <div className="flex gap-10 mt-[4rem]">
          {/* LEft */}
          <div className="flex flex-col gap-1">
            <h1 className="text-[#F2AF0D] text-[6rem] leading-none">
              Credible Score: 1309
            </h1>
            <p className="text-[#F2AF0D] text-[2rem] leading-none m-0">
              SUCCESS: 100 | DISPUTES: 20
            </p>
            <p className="text-[#F2AF0D] text-[2rem] leading-none m-0">
              LICENCED: YES
            </p>
            <button className="text-black bg-[#F2AF0D] px-4 py-2 rounded w-48 mt-1">
              VIEW HISTORY
            </button>
          </div>
          {/* Right */}
          <div className="flex">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
              alt="Broker Preview"
              className="w-auto h-[15rem] border-4 border-[#F2AF0D]"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

import React from "react";

export default function BrokerStatCard() {
  return (
    <div className="bg-black/40 py-[5rem] px-[3rem] flex items-start justify-start gap-10 w-fit">
      {/*  */}
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl leading-none text-center text-white">
          BROKER <br />
          STATS
        </h1>
        <div className="border-[7px] border-[#009917] rounded-full p-[2px] h-[7rem] w-[7rem]">
          <div className="border-[3px] border-[#11E7FF] rounded-full h-full w-full flex items-center justify-center flex-col text-white ">
            <h1 className="-mb-2 text-[10px] tracking-wider">CREDIPOINTS</h1>
            <p className="text-2xl leading-none">1849</p>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col items-start justify-start">
        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">Active</h1>
          <p className="tracking-wider text-white/40">License Status</p>
        </div>
        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">7</h1>
          <p className="tracking-wider text-white/40">Verified Credentials</p>
        </div>
        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">8</h1>
          <p className="tracking-wider text-white/40">Years Active</p>
        </div>
        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">3 days ago</h1>
          <p className="tracking-wider text-white/40">Last Verification</p>
        </div>
        {/* hr */}
        <div className="w-full my-4 border-b border-white"></div>

        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">214</h1>
          <p className="tracking-wider text-white/40">Verified Transactions</p>
        </div>
        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">27</h1>
          <p className="tracking-wider text-white/40">
            Avg Transations per Year
          </p>
        </div>
        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">100%</h1>
          <p className="tracking-wider text-white/40">Transaction Successes</p>
        </div>
        <div className="w-full my-4 border-b border-white"></div>
        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">0</h1>
          <p className="tracking-wider text-white/40">Completed Issues</p>
        </div>
      </div>
    </div>
  );
}

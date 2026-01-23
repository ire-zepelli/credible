import React from "react";

export default function BrokerStatCard({
  license = null,
  transactions = [],
  credentials = [],
  credibleScore = "-",
}) {
  // Calculate years active safely
  const yearsActive = license?.year_licensed
    ? new Date().getFullYear() -
      Number(license.year_licensed.toString().slice(0, 4))
    : "—";

  // Filter verified credentials safely
  const verifiedCredentialsCount = credentials
    ? credentials.filter((c) => c.is_confirmed).length
    : 0;

  // Filter verified transactions safely
  const verifiedTransactionsCount = transactions
    ? transactions.filter((t) => t.is_confirmed).length
    : 0;

  // Transactions this year safely
  const transactionsThisYear = transactions
    ? transactions.filter((t) => {
        const year = t.created_at ? new Date(t.created_at).getFullYear() : null;
        return year === new Date().getFullYear();
      }).length
    : 0;

  // Transaction success percentage safely
  const transactionSuccessPercent =
    transactions && transactions.length
      ? Math.round((verifiedTransactionsCount / transactions.length) * 100)
      : 0;

  return (
    <div className="bg-black/40 py-[5rem] px-[3rem] flex items-start justify-start gap-10 w-fit">
      {/* Stats Circle */}
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl leading-none text-center text-white">
          BROKER <br />
          STATS
        </h1>
        <div className="border-[7px] border-[#009917] rounded-full p-[2px] h-[7rem] w-[7rem]">
          <div className="border-[3px] border-[#11E7FF] rounded-full h-full w-full flex items-center justify-center flex-col text-white ">
            <h1 className="-mb-2 text-[10px] tracking-wider leading-none">
              CREDIPOINTS
            </h1>
            <p className="-m-[5px] text-6xl leading-none">
              {credibleScore ?? "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats List */}
      <div className="flex flex-col items-start justify-start">
        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">
            {license?.is_confirmed ? "Active" : "Inactive"}
          </h1>
          <p className="tracking-wider text-white/40">License Status</p>
        </div>

        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">{verifiedCredentialsCount}</h1>
          <p className="tracking-wider text-white/40">Verified Credentials</p>
        </div>

        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">{yearsActive}</h1>
          <p className="tracking-wider text-white/40">Years Active</p>
        </div>

        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">3 days ago</h1>
          <p className="tracking-wider text-white/40">Last Verification</p>
        </div>

        <div className="w-full my-4 border-b border-white"></div>

        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">{verifiedTransactionsCount}</h1>
          <p className="tracking-wider text-white/40">Verified Transactions</p>
        </div>

        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">{transactionsThisYear}</h1>
          <p className="tracking-wider text-white/40">Transactions This Year</p>
        </div>

        <div className="flex justify-between w-full gap-10 text-xs">
          <h1 className="text-[#F2AF0D]">{transactionSuccessPercent}%</h1>
          <p className="tracking-wider text-white/40">Transaction Successes</p>
        </div>

        <div className="w-full my-4 border-b border-white"></div>
      </div>
    </div>
  );
}

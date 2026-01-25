import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ethers } from "ethers";
import CredibleABI from "../abis/CredibleABI.json";
import reportIcon from "../assets/report_icon.png";
import ReportBrokerCard from "../components/ReportBrokerCard";
import credibleLogoAlt from "../assets/logo_w_slogan.png";
import BrokerActivityCard from "../components/BrokerActivityCard";
import helpIcon from "../assets/help_icon.png";

const CONTRACT_ADDRESS = "0xfDC9b0aDefA8b9a262c2c99dDB308F3b1B7E9aEb";

export default function BrokerPreview() {
  const { walletAddress } = useParams();

  const [showReport, setShowReport] = useState(false);
  const [user, setUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [license, setLicense] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [credibleScore, setCredibleScore] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTrustTier = (score) => {
    if (score === null || score === undefined || score < 1000) {
      return { label: "New Broker", color: "#8B8787" };
    }
    if (score < 1200) {
      return { label: "Low Trust", color: "#FF0000" };
    }
    if (score < 1500) {
      return { label: "Medium Trust", color: "#F2AF0D" };
    }
    return { label: "High Trust", color: "#00FF26" };
  };

  const trustTier = getTrustTier(credibleScore);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "x-wallet-address": walletAddress,
        };

        const [userRes, licenseRes, txRes, credRes] = await Promise.all([
          fetch(`http://localhost:3000/users/profile/${walletAddress}`, {
            headers,
          }),
          fetch(`http://localhost:3000/public/licenses/${walletAddress}`, {
            headers,
          }),
          fetch(`http://localhost:3000/transactions/${walletAddress}`, {
            headers,
          }),
          fetch(`http://localhost:3000/credentials/${walletAddress}`, {
            headers,
          }),
        ]);

        setUser(await userRes.json());
        const licenseData = await licenseRes.json();
        setLicense(licenseData[0]);
        setTransactions(await txRes.json());
        setCredentials(await credRes.json());
      } catch (err) {
        console.error("Error fetching broker data", err);
      }
    };

    const fetchCredibleScore = async () => {
      try {
        if (!window.ethereum) return;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CredibleABI,
          provider,
        );
        const broker = await contract.getBroker(walletAddress);
        setCredibleScore(broker[2].toNumber());
      } catch (err) {
        console.error("Error fetching credible score", err);
      }
    };

    Promise.all([fetchData(), fetchCredibleScore()]).finally(() =>
      setLoading(false),
    );
  }, [walletAddress]);

  if (loading) {
    return <p className="text-[#F2AF0D]">Loading…</p>;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {showHistory && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowHistory(false)}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2B2B2B] text-white w-[40rem] rounded-md">
            <BrokerActivityCard
              license={license}
              credentials={credentials}
              transactions={transactions}
            />
          </div>
        </div>
      )}

      {showReport && (
        <ReportBrokerCard
          reportedWallet={walletAddress}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* Background (your original) */}
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
      <header className="absolute top-0 left-0 z-20 flex justify-center w-full h-20">
        <Link to="/">
          <img
            src={credibleLogoAlt}
            alt="credible logo"
            className="h-[3rem] mt-3"
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 w-full h-full flex flex-col items-center pt-[10rem]">
        <h1 className="text-[#F2AF0D] text-[4rem] font-bold">
          can i trust{" "}
          <span className="text-white underline">{user.business_name}</span> ?
        </h1>

        <div className="flex gap-10 mt-[4rem]">
          {/* Left panel */}
          <div>
            <h1 className="text-[#F2AF0D] text-[6rem] leading-none tracking-wide">
              Credible{" "}
              <span style={{ color: trustTier.color }}>
                Score: {credibleScore ?? "-"}
              </span>
            </h1>

            <div className="grid grid-cols-[1fr_1fr_auto] gap-x-10 gap-y-2 text-[1.5rem] leading-none">
              <p className="text-[#F2AF0D]">
                Successful Transactions:{" "}
                <span className="text-white">{transactions.length}</span>
              </p>

              <p className="text-[#F2AF0D]">
                Email: <span className="text-white">{user.email}</span>
              </p>

              <p className="text-[#F2AF0D]">
                Credentials:{" "}
                <span className="text-white">{credentials.length}</span>
              </p>

              <p className="text-[#F2AF0D]">
                Phone: <span className="text-white">{user.phone_number}</span>
              </p>

              <p className="text-[#F2AF0D] col-span-2">
                License Verified:{" "}
                <span className="text-white">
                  {license?.is_confirmed ? "Yes" : "No"}
                </span>
              </p>

              {/* Trust tier badge */}
              <p className="relative flex items-center col-start-3 row-start-1 gap-2 -mt-4 text-base group">
                <span
                  className="w-[0.7rem] h-[0.7rem] rounded-full"
                  style={{ backgroundColor: trustTier.color }}
                />
                <span className="text-white">{trustTier.label}</span>

                <img
                  src={helpIcon}
                  alt="help"
                  className="w-[1rem] h-[1rem] cursor-pointer"
                />

                {/* Tooltip */}
                <div className="absolute left-0 z-30 hidden top-6 group-hover:block">
                  <div className="bg-[#1F1F1F] text-white text-sm rounded-md px-4 py-3 w-[18rem] shadow-lg">
                    <div className="grid grid-cols-2 gap-y-2">
                      <span style={{ color: "#8B8787" }}>New Broker</span>
                      <span className="text-right">Below 999</span>

                      <span style={{ color: "#FF0000" }}>Low Trust</span>
                      <span className="text-right">1000 – 1199</span>

                      <span style={{ color: "#F2AF0D" }}>Medium Trust</span>
                      <span className="text-right">1200 – 1499</span>

                      <span style={{ color: "#00FF26" }}>High Trust</span>
                      <span className="text-right">1500+</span>
                    </div>
                  </div>
                </div>
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                className="text-white bg-[#F2AF0D] px-4 py-2 rounded w-48"
                onClick={() => setShowHistory(true)}
              >
                VIEW HISTORY
              </button>

              <div
                className="flex items-center cursor-pointer"
                onClick={() => setShowReport(true)}
              >
                <img src={reportIcon} alt="report" className="h-[2rem]" />
                <span className="text-[#FF0000] underline ml-2">REPORT</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
            alt="Broker"
            className="h-[15rem] border-4 border-[#F2AF0D]"
          />
        </div>
      </main>
    </div>
  );
}

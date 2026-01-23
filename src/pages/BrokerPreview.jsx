import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ethers } from "ethers";
import CredibleABI from "../abis/CredibleABI.json";
import reportIcon from "../assets/report_icon.png";
import ReportBrokerCard from "../components/ReportBrokerCard";
import credibleLogoAlt from "../assets/logo_w_slogan.png";
import BrokerActivityCard from "../components/BrokerActivityCard";

const CONTRACT_ADDRESS = "0x18bd11044Da9183c07D8Ff7579a5161D9E6f87b9";

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

        const userData = await userRes.json();
        const licenseData = await licenseRes.json();
        const txData = await txRes.json();
        const credData = await credRes.json();

        setUser(userData);
        setLicense(licenseData);
        setTransactions(txData || []);
        setCredentials(credData || []);
      } catch (err) {
        console.error("Error fetching broker data", err);
      }
    };

    const fetchCredibleScore = async () => {
      if (!window.ethereum) return;

      try {
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
          className="fixed top-0 left-0 z-20 w-screen h-screen bg-black/20 backdrop-blur-sm"
          onClick={() => {
            setShowHistory(false);
          }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2B2B2B] text-white w-[40rem] h-fit flex flex-col rounded-md">
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

      <header className="absolute top-0 left-0 z-20 flex justify-center w-full h-20">
        <Link to="/">
          <img
            src={credibleLogoAlt}
            alt="credible logo with slogan"
            className="h-[3rem] mt-3"
          />
        </Link>
      </header>

      <main className="relative z-10 w-full h-full flex flex-col items-center pt-[10rem]">
        <h1 className="text-[#F2AF0D] text-[4rem] font-bold">
          can i trust <span className="underline">{user.business_name}</span> ?
        </h1>

        <div className="flex gap-10 mt-[4rem]">
          {/* Left */}
          <div>
            <h1 className="text-[#F2AF0D] text-[6rem] leading-none">
              Credible Score: {credibleScore ?? "-"}
            </h1>
            <div className="flex gap-20 text-[1.5rem] leading-none">
              <p className="text-[#F2AF0D]">
                Successful Transactions:{" "}
                <span className="text-white">{transactions.length}</span>
              </p>
              <p className="text-[#F2AF0D]">
                Email: <span className="text-white">{user.email}</span>
              </p>
            </div>
            <div className="flex gap-20 text-[1.5rem] leading-none">
              <p className="text-[#F2AF0D]">
                Credentials:{" "}
                <span className="text-white">{credentials.length}</span>
              </p>
              <p className="text-[#F2AF0D]">
                Phone: <span className="text-white">{user.phone_number}</span>
              </p>
            </div>
            <div className="flex gap-20 text-[1.5rem] leading-none">
              <p className="text-[#F2AF0D]">
                License Verified:{" "}
                <span className="text-white">
                  {license.is_confirmed ? "Yes" : "No"}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <button
                className="text-black bg-[#F2AF0D] px-4 py-2 rounded w-48"
                onClick={() => {
                  setShowHistory(true);
                }}
              >
                VIEW HISTORY
              </button>

              <div
                className="flex items-center cursor-pointer"
                onClick={() => setShowReport(true)}
              >
                <img src={reportIcon} alt="report" className="h-[2rem]" />
                <h1 className="text-[#FF0000] underline ml-2">REPORT</h1>
              </div>
            </div>
          </div>

          {/* Right */}
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

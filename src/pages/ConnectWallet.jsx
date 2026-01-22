import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to connect MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it to connect.");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  };

  // Check backend when walletAddress changes
  useEffect(() => {
    if (!walletAddress) return;

    const checkUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/check/${walletAddress}`,
        );
        const data = await response.json();

        if (data.exists) {
          navigate(`/profile/${walletAddress}`);
        } else {
          navigate(`/register?walletAddress=${walletAddress}`);
        }
      } catch (err) {
        console.error("Error checking wallet:", err);
        setError("Failed to check wallet in backend.");
      }
    };

    checkUser();
  }, [walletAddress, navigate]);

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

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-3">
        <h1 className="text-[#F2AF0D] text-[6rem] font-bold">Credible</h1>

        {walletAddress ? (
          <div className="text-2xl text-white">
            Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="px-3 py-1 text-white bg-[#F2AF0D] rounded-xl text-2xl"
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {error && <p className="mt-2 text-red-500">{error}</p>}
      </main>

      <Link to="/" className="absolute z-10 text-white bottom-10 right-10">
        Return to Home
      </Link>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/business.png";
import { ethers } from "ethers";
import CredibleABI from "../abis/CredibleABI.json";

const CONTRACT_ADDRESS = "0x18bd11044Da9183c07D8Ff7579a5161D9E6f87b9";

export default function Register() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-connect if wallet already authorized
  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) setWalletAddress(accounts[0]);
        } catch (err) {
          console.error("Wallet check error:", err);
        }
      }
    };
    checkWallet();
  }, []);

  const handleSubmit = async () => {
    setError(null);

    if (!businessName) {
      setError("Business name is required.");
      return;
    }

    if (!window.ethereum) {
      setError("MetaMask is required to register on-chain.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Connect wallet if not already connected
      let wallet = walletAddress;
      if (!wallet) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        wallet = accounts[0];
        setWalletAddress(wallet);
      }

      // 2️⃣ Send user info to backend to get profile hash
      const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: wallet,
          businessName,
          email,
          phoneNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to register.");
        setLoading(false);
        return;
      }

      const profileHash = data.profileHash || data.profile_hash;

      // 3️⃣ Connect to Ethereum provider & signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // 4️⃣ Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CredibleABI,
        signer,
      );

      // 5️⃣ Convert SHA256 hash to bytes32
      const hashBytes32 = ethers.utils.arrayify("0x" + profileHash);

      // 6️⃣ Send on-chain transaction
      const tx = await contract.registerBroker(hashBytes32);
      console.log("Transaction sent:", tx.hash);

      // 7️⃣ Wait for transaction confirmation
      await tx.wait();
      console.log("Broker registered on-chain:", tx.hash);

      // 8️⃣ Navigate to profile page
      navigate(`/profile/${wallet}`);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#1F1E1F]">
      <div className="flex flex-col">
        <h1 className="text-[#F2AF0D] text-[4rem] leading-none">Credible</h1>
        <div className="flex flex-row w-fit">
          <img src={img} alt="business" className="h-[34rem]" />
          <div className="bg-[#252525] w-[45rem] flex flex-col p-10">
            <h1 className="text-white">
              Your information is requested to enhance accuracy, maintain
              transparency, and establish trust.
            </h1>

            <div className="flex flex-row flex-wrap gap-10 mt-6 text-white">
              <div className="flex flex-col">
                <label htmlFor="name">Business Name: </label>
                <input
                  type="text"
                  id="name"
                  className="text-black w-[15rem]"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email">Email: </label>
                <input
                  type="text"
                  id="email"
                  className="text-black w-[15rem]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone">Phone: </label>
                <input
                  type="text"
                  id="phone"
                  className="text-black w-[15rem]"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="mt-2 text-red-500">{error}</p>}

            <button
              onClick={handleSubmit}
              className="px-3 py-1 text-white bg-[#F2AF0D] rounded mt-1 self-end text-lg"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

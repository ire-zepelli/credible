import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CredibleABI from "../abis/CredibleABI.json";

const CONTRACT_ADDRESS = "0x18bd11044Da9183c07D8Ff7579a5161D9E6f87b9";

export default function AddCredentialsCard({ onClose }) {
  const [walletAddress, setWalletAddress] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [credentialFile, setCredentialFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-connect wallet
  useEffect(() => {
    const checkWallet = async () => {
      if (!window.ethereum) return;
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length) setWalletAddress(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    };
    checkWallet();
  }, []);

  const handleSubmit = async () => {
    setError(null);

    // Connect wallet
    if (!walletAddress) {
      if (!window.ethereum) {
        setError("MetaMask required.");
        return;
      }
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch {
        setError("Wallet connection failed.");
        return;
      }
    }

    // Validate
    if (!title.trim() || !(credentialFile instanceof File)) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      // ---------------- OFFCHAIN SAVE ----------------
      const payload = {
        broker_wallet: walletAddress,
        title,
        description,
        credential_image_url: credentialFile.name,
      };

      const res = await fetch("http://localhost:3000/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save credential.");
        setLoading(false);
        return;
      }

      const credentialHash = data.credential_hash;
      console.log("Credential hash:", credentialHash);

      // ---------------- ONCHAIN SAVE ----------------
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CredibleABI,
        signer,
      );

      const hashBytes32 = ethers.utils.arrayify(credentialHash);

      const tx = await contract.addCredential(hashBytes32);
      console.log("On-chain tx:", tx.hash);

      await tx.wait();
      console.log("Credential confirmed on-chain");

      onClose();
    } catch (err) {
      console.error("Credential error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-20 w-screen h-screen bg-black/20 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2B2B2B] text-white w-[40rem] rounded-[2rem] p-8 flex flex-col">
        <div className="flex items-center justify-between">
          <h1>Add Credential</h1>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <h1>Title</h1>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#222222] px-2 py-1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1>Upload File</h1>
            <input
              type="file"
              onChange={(e) => setCredentialFile(e.target.files[0] || null)}
              className="bg-[#222222]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1>Description</h1>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#222222] px-2 py-1"
            />
            <p className="text-xs text-gray-400">
              Upload valid credentials or licenses for verification.
            </p>
          </div>
        </div>

        {error && <p className="mt-3 text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="self-end mt-6 px-4 py-2 bg-[#F2AF0D] text-black rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

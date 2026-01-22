import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CredibleABI from "../abis/CredibleABI.json";

const CONTRACT_ADDRESS = "0x9dB3A589cFB95587B6Ff9B21CDD4B5FAB300A8d6";

export default function AddTransactionCard({ onClose }) {
  const [walletAddress, setWalletAddress] = useState(null);

  const [title, setTitle] = useState("");
  const [clientIdFile, setClientIdFile] = useState(null);
  const [description, setDescription] = useState("");
  const [unitSold, setUnitSold] = useState("");
  const [proofFile, setProofFile] = useState(null);

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

    // 1️⃣ Connect wallet if not connected
    if (!walletAddress) {
      if (!window.ethereum) {
        setError("MetaMask is required to submit a transaction.");
        return;
      }
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to connect wallet.");
        return;
      }
    }

    // 2️⃣ Validate required fields
    if (
      !title.trim() ||
      !unitSold.trim() ||
      !(clientIdFile instanceof File) ||
      !(proofFile instanceof File)
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      // 3️⃣ Prepare payload for backend
      const payload = {
        broker_wallet: walletAddress,
        client_id_url: clientIdFile.name, // just the file name
        title,
        description,
        unit_sold: unitSold, // now text
        proof_image_url: proofFile.name, // just the file name
      };

      // 4️⃣ Send to backend
      const res = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit transaction.");
        setLoading(false);
        return;
      }

      const txHash = data.tx_hash;
      console.log("Backend tx_hash:", txHash);

      // 5️⃣ Send on-chain transaction
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CredibleABI,
        signer,
      );

      // Convert backend tx_hash to bytes32
      const hashBytes32 = ethers.utils.arrayify(txHash);

      const tx = await contract.initiateTransaction(hashBytes32);
      console.log("On-chain transaction sent:", tx.hash);
      await tx.wait();
      console.log("On-chain transaction confirmed:", tx.hash);

      // 6️⃣ Close modal after success
      onClose();
    } catch (err) {
      console.error("Transaction submission error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-30 w-screen h-screen bg-black/20 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2B2B2B] text-white w-[40rem] rounded-[2rem] p-8 flex flex-col">
        <div className="flex justify-between items-center">
          <h1>Add Transaction</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col mt-4 gap-4">
          <div className="flex flex-col gap-2">
            <h1>Title</h1>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#222222] px-2 py-1"
            />
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex flex-col gap-2 w-1/2">
              <h1>Client ID</h1>
              <input
                type="file"
                onChange={(e) => setClientIdFile(e.target.files[0] || null)}
                className="bg-[#222222] px-2 py-1"
              />
            </div>

            <div className="flex flex-col gap-2 w-1/2">
              <h1>Upload Proof</h1>
              <input
                type="file"
                onChange={(e) => setProofFile(e.target.files[0] || null)}
                className="bg-[#222222] px-2 py-1"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1>Description</h1>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#222222] px-2 py-1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1>Units Sold</h1>
            <input
              type="text"
              value={unitSold}
              onChange={(e) => setUnitSold(e.target.value)}
              className="bg-[#222222] px-2 py-1"
            />
            <p className="text-xs text-gray-400">
              Upload proof of completed transactions, such as payment receipts
              or confirmation documents.
            </p>
          </div>
        </div>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          className="self-end mt-4 px-4 py-2 bg-[#F2AF0D] text-black rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

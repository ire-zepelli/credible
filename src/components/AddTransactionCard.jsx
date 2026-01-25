import React, { useState, useEffect } from "react";

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

    // Optional: Connect wallet if not connected
    if (!walletAddress && window.ethereum) {
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

    // Validate required fields
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
      // Prepare payload for backend
      const payload = {
        broker_wallet: walletAddress,
        client_id_url: clientIdFile.name,
        title,
        description,
        unit_sold: unitSold,
        proof_image_url: proofFile.name,
      };

      // Send to backend
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

      console.log("Transaction saved off-chain:", data);

      // Close modal after success
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
        <div className="flex items-center justify-between">
          <h1>Add Transaction</h1>
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

          <div className="flex justify-between gap-4">
            <div className="flex flex-col w-1/2 gap-2">
              <h1>Client ID</h1>
              <input
                type="file"
                onChange={(e) => setClientIdFile(e.target.files[0] || null)}
                className="bg-[#222222] px-2 py-1"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
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

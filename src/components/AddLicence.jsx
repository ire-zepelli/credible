import React, { useState, useEffect } from "react";

export default function AddLicence({ walletAddress: initialWallet, onClose }) {
  const [walletAddress, setWalletAddress] = useState(initialWallet || null);
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Auto-connect wallet if not provided
  useEffect(() => {
    const checkWallet = async () => {
      if (!walletAddress && window.ethereum) {
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
  }, [walletAddress]);

  const handleSubmit = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!frontFile || !backFile || !expirationDate) {
      setError("Please fill in all fields and upload both files.");
      return;
    }

    if (!walletAddress) {
      // Request connection if wallet not connected
      if (!window.ethereum) {
        setError("MetaMask is required to add a license.");
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

    setLoading(true);

    try {
      // Send data to backend (off-chain)
      const payload = {
        broker_wallet: walletAddress,
        license_front_url: frontFile.name, // just the file name/path
        license_back_url: backFile.name,
        expiration_date: expirationDate,
      };

      const res = await fetch("http://localhost:3000/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add license.");
        setLoading(false);
        return;
      }

      setSuccessMsg("License added successfully!");
      setFrontFile(null);
      setBackFile(null);
      setExpirationDate("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while adding the license.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-20 w-screen h-screen bg-black/20 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2B2B2B] text-white w-[40rem] h-fit rounded-[2rem] p-8 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add License</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label>Upload Front ID</label>
            <input
              type="file"
              onChange={(e) => setFrontFile(e.target.files[0])}
              className="bg-[#222222] text-white px-2 py-1 w-full"
            />
          </div>

          <div>
            <label>Upload Back ID</label>
            <input
              type="file"
              onChange={(e) => setBackFile(e.target.files[0])}
              className="bg-[#222222] text-white px-2 py-1 w-full"
            />
          </div>

          <div>
            <label>Expiration Date</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="bg-[#222222] text-white px-2 py-1 w-full"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {successMsg && <p className="text-green-500">{successMsg}</p>}

          <button
            onClick={handleSubmit}
            className="self-end px-4 py-2 bg-[#F2AF0D] text-black rounded"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

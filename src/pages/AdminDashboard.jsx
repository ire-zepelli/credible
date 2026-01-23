import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CredibleABI from "../abis/CredibleABI.json";

const CONTRACT_ADDRESS = "0x18bd11044Da9183c07D8Ff7579a5161D9E6f87b9";

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD DATA ----------------
  const loadData = async () => {
    try {
      const [txRes, credRes, licRes] = await Promise.all([
        fetch("http://localhost:3000/admin/pending/transactions"),
        fetch("http://localhost:3000/admin/pending/credentials"),
        fetch("http://localhost:3000/admin/pending/licenses"),
      ]);

      setTransactions(await txRes.json());
      setCredentials(await credRes.json());
      setLicenses(await licRes.json());
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------- CONNECT WALLET ----------------
  const connectWallet = async () => {
    if (!window.ethereum) throw new Error("MetaMask required");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  };

  // ---------------- HANDLE ACTION ----------------
  const handleAction = async (type, item, action) => {
    setLoading(true);

    let endpoint = "";
    let body = {};

    switch (type) {
      case "transaction":
        endpoint = `http://localhost:3000/admin/${action}/transaction`;
        body = { tx_hash: item.tx_hash };
        break;
      case "credential":
        endpoint = `http://localhost:3000/admin/${action}/credential`;
        body = { credential_hash: item.credential_hash };
        break;
      case "license":
        endpoint = `http://localhost:3000/admin/${action}/license`;
        body = { license_id: item.id };
        break;
      default:
        setLoading(false);
        return;
    }

    try {
      // ---------------- OFFCHAIN CONFIRM/DENY ----------------
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to update item off-chain");

      // ---------------- ONCHAIN CONFIRM ----------------
      if (
        action === "confirm" &&
        ["license", "credential", "transaction"].includes(type)
      ) {
        const adminWallet = await connectWallet();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(adminWallet);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CredibleABI,
          signer,
        );

        if (type === "license") {
          // For licenses: use broker wallet
          const brokerAddress = item.broker_wallet;
          const tx = await contract.verifyCredential(brokerAddress);
          console.log("License verified on-chain:", tx.hash);
          await tx.wait();
        } else if (type === "credential") {
          // For credentials: use credential hash
          const hashBytes32 = item.credential_hash.startsWith("0x")
            ? item.credential_hash
            : ethers.utils.hexlify(
                ethers.utils.toUtf8Bytes(item.credential_hash),
              );
          const tx = await contract.confirmCredential(hashBytes32);
          console.log("Credential confirmed on-chain:", tx.hash);
          await tx.wait();
        } else if (type === "transaction") {
          // For transactions: use tx hash
          const hashBytes32 = item.tx_hash.startsWith("0x")
            ? item.tx_hash
            : ethers.utils.hexlify(ethers.utils.toUtf8Bytes(item.tx_hash));
          const tx = await contract.confirmTransaction(hashBytes32);
          console.log("Transaction confirmed on-chain:", tx.hash);
          await tx.wait();
        }
      }

      // Refresh data
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HELPER: STATUS ----------------
  const renderStatus = (item) => {
    if (item.is_confirmed === true)
      return <span className="text-green-500">Confirmed</span>;
    if (item.is_confirmed === null)
      return <span className="text-red-500">Denied</span>;
    return <span className="text-yellow-400">Pending</span>;
  };

  // ---------------- RENDER ----------------
  return (
    <div className="p-10 text-white bg-[#121212] min-h-screen">
      <h1 className="mb-6 text-3xl">Admin Verification Dashboard</h1>

      {/* TRANSACTIONS */}
      <h2 className="mb-3 text-xl">Pending Transactions</h2>
      {transactions.length === 0 && <p>No pending transactions.</p>}
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="bg-[#1e1e1e] p-4 rounded mb-3 flex flex-col gap-2"
        >
          <p>
            <b>Status:</b> {renderStatus(tx)}
          </p>
          <p>
            <b>Broker:</b> {tx.broker_wallet}
          </p>
          <p>
            <b>Tx Hash:</b> {tx.tx_hash}
          </p>
          <p>
            <b>Title:</b> {tx.title}
          </p>
          <p>
            <b>Unit Sold:</b> {tx.unit_sold}
          </p>
          <p>
            <b>Description:</b> {tx.description}
          </p>
          <div className="flex gap-4">
            <div>
              <p>
                <b>Client ID:</b>
              </p>
              {tx.client_id_url ? (
                <img
                  src={`/${tx.client_id_url}`}
                  alt="Client ID"
                  className="w-48 h-auto border rounded"
                />
              ) : (
                <p className="text-gray-400">No image</p>
              )}
            </div>
            <div>
              <p>
                <b>Proof:</b>
              </p>
              {tx.proof_image_url ? (
                <img
                  src={`/${tx.proof_image_url}`}
                  alt="Proof"
                  className="w-48 h-auto border rounded"
                />
              ) : (
                <p className="text-gray-400">No image</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              disabled={loading || tx.is_confirmed === true}
              onClick={() => handleAction("transaction", tx, "confirm")}
              className="px-4 py-1 text-black bg-green-500 rounded"
            >
              Confirm
            </button>
            <button
              disabled={loading || tx.is_confirmed === null}
              onClick={() => handleAction("transaction", tx, "deny")}
              className="px-4 py-1 text-black bg-red-500 rounded"
            >
              Deny
            </button>
          </div>
        </div>
      ))}

      {/* CREDENTIALS */}
      <h2 className="mt-10 mb-3 text-xl">Pending Credentials</h2>
      {credentials.length === 0 && <p>No pending credentials.</p>}
      {credentials.map((cred) => (
        <div
          key={cred.id}
          className="bg-[#1e1e1e] p-4 rounded mb-3 flex flex-col gap-2"
        >
          <p>
            <b>Status:</b> {renderStatus(cred)}
          </p>
          <p>
            <b>Broker:</b> {cred.broker_wallet}
          </p>
          <p>
            <b>Hash:</b> {cred.credential_hash}
          </p>
          <p>
            <b>Title:</b> {cred.title}
          </p>
          <p>
            <b>Description:</b> {cred.description}
          </p>
          {cred.credential_image_url ? (
            <img
              src={`/${cred.credential_image_url}`}
              alt="Credential"
              className="w-48 h-auto border rounded"
            />
          ) : (
            <p className="text-gray-400">No image</p>
          )}
          <div className="flex gap-2 mt-2">
            <button
              disabled={loading || cred.is_confirmed === true}
              onClick={() => handleAction("credential", cred, "confirm")}
              className="px-4 py-1 text-black bg-blue-500 rounded"
            >
              Confirm
            </button>
            <button
              disabled={loading || cred.is_confirmed === null}
              onClick={() => handleAction("credential", cred, "deny")}
              className="px-4 py-1 text-black bg-red-500 rounded"
            >
              Deny
            </button>
          </div>
        </div>
      ))}

      {/* LICENSES */}
      <h2 className="mt-10 mb-3 text-xl">Pending Licenses</h2>
      {licenses.length === 0 && <p>No pending licenses.</p>}
      {licenses.map((lic) => (
        <div
          key={lic.id}
          className="bg-[#1e1e1e] p-4 rounded mb-3 flex flex-col gap-2"
        >
          <p>
            <b>Status:</b> {renderStatus(lic)}
          </p>
          <p>
            <b>Broker:</b> {lic.broker_wallet}
          </p>
          <div className="flex gap-4">
            <div>
              <p>
                <b>License Front:</b>
              </p>
              {lic.license_front_url ? (
                <img
                  src={`/${lic.license_front_url}`}
                  alt="License Front"
                  className="w-48 h-auto border rounded"
                />
              ) : (
                <p className="text-gray-400">No image</p>
              )}
            </div>
            <div>
              <p>
                <b>License Back:</b>
              </p>
              {lic.license_back_url ? (
                <img
                  src={`/${lic.license_back_url}`}
                  alt="License Back"
                  className="w-48 h-auto border rounded"
                />
              ) : (
                <p className="text-gray-400">No image</p>
              )}
            </div>
          </div>
          <p>
            <b>Year Licensed:</b> {lic.year_licensed.toString().slice(0, 4)}
          </p>
          <div className="flex gap-2 mt-2">
            <button
              disabled={loading || lic.is_confirmed === true}
              onClick={() => handleAction("license", lic, "confirm")}
              className="px-4 py-1 text-black bg-yellow-500 rounded"
            >
              Confirm
            </button>
            <button
              disabled={loading || lic.is_confirmed === null}
              onClick={() => handleAction("license", lic, "deny")}
              className="px-4 py-1 text-black bg-red-500 rounded"
            >
              Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

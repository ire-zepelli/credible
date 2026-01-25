import { useState, useEffect } from "react";
import { ethers } from "ethers";
import MainLayout from "../components/layout/MainLayout";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import DataTable from "../components/tables/DataTable";
import DetailModal from "../components/modals/DetailModal";
import DenialModal from "../components/modals/DenialModal";
import { COOLVETICA_FONT } from "../utils/constants";
import CredibleABI from "../abis/CredibleABI.json";

const CONTRACT_ADDRESS = "0xfDC9b0aDefA8b9a262c2c99dDB308F3b1B7E9aEb";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("transactions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [loadingBlockchain, setLoadingBlockchain] = useState(false);

  const [data, setData] = useState({
    transactions: [],
    credentials: [],
    licenses: [],
    reports: [],
  });

  // ---------------- WALLET & CONTRACT ----------------
  const connectWallet = async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const getContract = async () => {
    await connectWallet();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CredibleABI, signer);
  };

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchAdminData = async () => {
      const results = await Promise.allSettled([
        fetch("http://localhost:3000/admin/transactions"),
        fetch("http://localhost:3000/admin/credentials"),
        fetch("http://localhost:3000/admin/licenses"),
        fetch("http://localhost:3000/admin/reports"),
      ]);

      const mapData = (raw, type) =>
        raw.map((item) => {
          if (type === "reports") {
            return {
              id: item.id,
              type,
              name: item.wallet_address || "Unknown",
              title: item.title || "Report",
              walletAddress: item.wallet_address,
              reportHash: item.report_hash,
              status: item.is_confirmed
                ? "approved"
                : item.deny_message
                  ? "denied"
                  : "pending",
              denyMessage: item.deny_message,
              createdAt: item.created_at,
            };
          }

          return {
            id: item.id,
            type,
            name: item.name,
            email: item.email,
            walletAddress: item.wallet_address,
            title: item.title,
            description: item.description,
            files: [
              item.client_id_url,
              item.proof_image_url,
              item.credential_image_url,
              item.license_front_url,
              item.license_back_url,
              item.evidence_url,
            ].filter(Boolean),
            unitSold: item.unit_sold,
            tx_hash: item.tx_hash,
            credential_hash: item.credential_hash,
            license_id: item.id,
            reportHash: item.report_hash,
            status: item.is_confirmed
              ? "approved"
              : item.deny_message
                ? "denied"
                : "pending",
            denyMessage: item.deny_message,
            createdAt: item.created_at,
          };
        });

      setData({
        transactions:
          results[0].status === "fulfilled"
            ? mapData(await results[0].value.json(), "transactions")
            : [],
        credentials:
          results[1].status === "fulfilled"
            ? mapData(await results[1].value.json(), "credentials")
            : [],
        licenses:
          results[2].status === "fulfilled"
            ? mapData(await results[2].value.json(), "licenses")
            : [],
        reports:
          results[3].status === "fulfilled"
            ? mapData(await results[3].value.json(), "reports")
            : [],
      });
    };

    fetchAdminData();
  }, []);

  // ---------------- HELPERS ----------------
  const updateItemStatus = (type, id, status, reason = null) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === id ? { ...item, status, denyMessage: reason } : item,
      ),
    }));
  };

  // ---------------- DENY ----------------
  const sendDenyRequest = async (type, item, reason) => {
    let url = "";
    let payload = {};

    if (type === "transactions") {
      url = "http://localhost:3000/admin/deny/transaction";
      payload = { tx_hash: item.tx_hash, deny_message: reason };
    } else if (type === "credentials") {
      url = "http://localhost:3000/admin/deny/credential";
      payload = { credential_hash: item.credential_hash, deny_message: reason };
    } else if (type === "licenses") {
      url = "http://localhost:3000/admin/deny/license";
      payload = { license_id: item.license_id, deny_message: reason };
    } else if (type === "reports") {
      url = "http://localhost:3000/admin/deny/report";
      payload = { report_hash: item.reportHash, deny_message: reason };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Deny failed");
    return res.json();
  };

  // ---------------- APPROVE ----------------
  const sendApproveRequest = async (type, item) => {
    let url = "";
    let payload = {};

    if (type === "transactions") {
      url = "http://localhost:3000/admin/approve/transaction";
      payload = { tx_hash: item.tx_hash };
    } else if (type === "credentials") {
      url = "http://localhost:3000/admin/approve/credential";
      payload = { credential_hash: item.credential_hash };
    } else if (type === "licenses") {
      url = "http://localhost:3000/admin/approve/license";
      payload = { license_id: item.license_id };
    } else if (type === "reports") {
      url = "http://localhost:3000/admin/approve/report";
      payload = { report_hash: item.reportHash };
    } else {
      throw new Error("Unknown type");
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error("Backend approve failed: " + text);
    }

    return res.json();
  };

  const sendApproveToBlockchain = async (type, item) => {
    setLoadingBlockchain(true);
    const contract = await getContract();

    let tx;
    if (type === "transactions") {
      tx = await contract.confirmTransaction(item.tx_hash);
    } else if (type === "credentials") {
      tx = await contract.confirmCredential(item.credential_hash);
    } else if (type === "reports") {
      tx = await contract.confirmReport(item.reportHash);
    } else if (type === "licenses") {
      tx = await contract.verifyBroker(item.walletAddress);
    } else {
      throw new Error("Unknown type");
    }

    await tx.wait();
    setLoadingBlockchain(false);
  };

  const handleApprove = async () => {
    if (!selectedItem) return;

    try {
      setLoadingBlockchain(true);

      // 1️⃣ Blockchain first
      await sendApproveToBlockchain(selectedItem.type, selectedItem);

      // 2️⃣ Backend updates off-chain status
      await sendApproveRequest(selectedItem.type, selectedItem);

      // 3️⃣ UI update
      updateItemStatus(selectedItem.type, selectedItem.id, "approved");
      setSelectedItem(null);
    } catch (err) {
      console.error("Approve failed:", err);
      alert("Approve failed: " + err.message);
    } finally {
      setLoadingBlockchain(false);
    }
  };

  const handleDenyClick = () => {
    setPendingAction({ id: selectedItem.id, type: selectedItem.type });
    setShowDenyModal(true);
  };

  const handleDenySubmit = async (reason) => {
    try {
      await sendDenyRequest(pendingAction.type, selectedItem, reason);
      updateItemStatus(pendingAction.type, pendingAction.id, "denied", reason);
      setShowDenyModal(false);
      setSelectedItem(null);
      setPendingAction(null);
    } catch (err) {
      alert("Failed to deny item");
      console.error(err);
    }
  };

  const filteredData =
    data[activeTab]?.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.denyMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <MainLayout>
      <Sidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main style={COOLVETICA_FONT} className="flex-1 p-10 overflow-y-auto">
          <DataTable
            data={filteredData}
            onInspect={(item) => setSelectedItem({ ...item, type: activeTab })}
          />
        </main>
      </div>

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onApprove={handleApprove}
        onDeny={handleDenyClick}
        loading={loadingBlockchain}
      />

      <DenialModal
        isOpen={showDenyModal}
        onClose={() => setShowDenyModal(false)}
        onSubmit={handleDenySubmit}
      />
    </MainLayout>
  );
}

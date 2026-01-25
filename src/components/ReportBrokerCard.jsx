import React, { useState } from "react";

export default function ReportBrokerCard({ onClose, reportedWallet }) {
  const [idFile, setIdFile] = useState(null);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);

    // Validate required fields
    if (!description || !idFile) {
      setError("ID and description are required.");
      return;
    }

    setLoading(true);

    try {
      // Prepare payload for backend
      const payload = {
        brokerWallet: reportedWallet,
        reason: description,
        reporter_id: idFile.name,
        evidence_url: evidenceFile ? evidenceFile.name : null,
      };

      const res = await fetch("http://localhost:3000/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit report");
      }

      console.log("Report saved off-chain:", data);

      // Close modal
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-20 w-screen h-screen bg-black/20 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2B2B2B] text-white w-[40rem] h-fit rounded-[2rem] p-8 flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">File Report</h1>
          <button onClick={onClose} className="text-sm opacity-70">
            ✕
          </button>
        </div>

        <div className="flex flex-row gap-4 mt-4">
          {/* LEFT */}
          <div className="flex flex-col w-1/2">
            <div className="flex flex-col gap-2 mt-4">
              <h1>Upload ID</h1>
              <input
                type="file"
                className="bg-[#222222]"
                onChange={(e) => setIdFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col w-1/2">
            <div className="flex flex-col gap-2 mt-4">
              <h1>Upload Evidence (optional)</h1>
              <input
                type="file"
                className="bg-[#222222]"
                onChange={(e) => setEvidenceFile(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <h1>Description</h1>
          <textarea
            rows="5"
            className="bg-[#222222] w-full p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="self-end mt-4 px-4 py-2 bg-[#F2AF0D] text-black rounded"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
}

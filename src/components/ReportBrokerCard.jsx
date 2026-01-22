import React, { useState } from "react";

export default function ReportBrokerCard({ onClose, reportedWallet }) {
  const [idFile, setIdFile] = useState(null);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!description || !idFile) {
      setError("ID and description are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("reportedWallet", reportedWallet);
      formData.append("description", description);
      formData.append("idFile", idFile);
      if (evidenceFile) {
        formData.append("evidenceFile", evidenceFile);
      }

      const response = await fetch("http://localhost:3000/reports", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      onClose(); // close modal after success
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-20 w-screen h-screen bg-black/20 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2B2B2B] text-white w-[40rem] h-[30rem] rounded-[2rem] p-8 flex flex-col">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">File Report</h1>
          <button onClick={onClose} className="text-sm opacity-70">
            ✕
          </button>
        </div>

        <div className="flex flex-row mt-4 gap-4 flex-1">
          {/* LEFT */}
          <div className="flex flex-col w-1/2">
            <div className="flex flex-col gap-2 mt-4">
              <h1 className="leading-none">Upload ID</h1>
              <input
                type="file"
                className="bg-[#222222]"
                onChange={(e) => setIdFile(e.target.files[0])}
              />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <h1 className="leading-none">Description</h1>
              <textarea
                rows="5"
                className="bg-[#222222] w-full p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs opacity-70">
                Upload valid credentials or licenses for verification.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col w-1/2">
            <div className="flex flex-col gap-2 mt-4">
              <h1 className="leading-none">Upload Evidence (optional)</h1>
              <input
                type="file"
                className="bg-[#222222]"
                onChange={(e) => setEvidenceFile(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

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

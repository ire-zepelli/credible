import React, { useState } from "react";
import transactionIcon from "../assets/transaction_icon.png";
import licenseIcon from "../assets/license_icon.png";
import credentialIcon from "../assets/credential_icon.png";
import AddCredentialsCard from "./AddCredentialsCard";
import AddLicence from "./AddLicence";
import AddTransactionCard from "./AddTransactionCard";

export default function AddCredits({ onClose }) {
  const [activeModal, setActiveModal] = useState(null); // null, 'credential', 'transaction', 'license'

  const handleOpenModal = (type) => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleCloseAll = () => {
    setActiveModal(null);
    onClose?.();
  };

  return (
    <>
      {/* Main Selection Modal */}
      {activeModal === null && (
        <div className="fixed top-0 left-0 z-20 w-screen h-screen bg-black/20 backdrop-blur-sm">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2B2B2B] text-white rounded-[2rem] p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Add Credits</h1>
              <button
                onClick={handleCloseAll}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex flex-row gap-10">
              <button
                onClick={() => handleOpenModal("credential")}
                className="bg-[#222222] hover:bg-[#333333] transition-colors flex justify-center flex-col items-center p-5 rounded-xl w-[12rem] h-[8rem] cursor-pointer"
              >
                <h2 className="text-xl">Add Credentials</h2>
                <img
                  src={credentialIcon}
                  alt="credential icon"
                  className="w-[4rem] mt-2"
                />
              </button>

              <button
                onClick={() => handleOpenModal("transaction")}
                className="bg-[#222222] hover:bg-[#333333] transition-colors flex justify-center flex-col items-center p-5 rounded-xl w-[12rem] h-[8rem] cursor-pointer"
              >
                <h2 className="text-xl">Add Transaction</h2>
                <img
                  src={transactionIcon}
                  alt="transaction icon"
                  className="w-[4rem] mt-2"
                />
              </button>

              <button
                onClick={() => handleOpenModal("license")}
                className="bg-[#222222] hover:bg-[#333333] transition-colors flex justify-center flex-col items-center p-5 rounded-xl w-[12rem] h-[8rem] cursor-pointer"
              >
                <h2 className="text-xl">Add License</h2>
                <img
                  src={licenseIcon}
                  alt="license icon"
                  className="w-[4rem] mt-2"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Modals */}
      {activeModal === "credential" && (
        <AddCredentialsCard
          onClose={handleCloseModal}
          onBack={handleCloseModal}
        />
      )}
      {activeModal === "transaction" && (
        <AddTransactionCard
          onClose={handleCloseModal}
          onBack={handleCloseModal}
        />
      )}
      {activeModal === "license" && (
        <AddLicence onClose={handleCloseModal} onBack={handleCloseModal} />
      )}
    </>
  );
}

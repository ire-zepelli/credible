import React, { useEffect, useState } from "react";
import { useParams, Link, NavLink, Links } from "react-router-dom";
import credibleLogo from "../assets/credible_logo.png";
import credibleLogoAlt from "../assets/logo_w_slogan.png";
import logOutIcon from "../assets/logout_icon.png";
import verifiedBadge from "../assets/verified_icon.png";
import BrokerStatCard from "../components/BrokerStatCard";
import BrokerActivityCard from "../components/BrokerActivityCard";
import AddCredits from "../components/AddCredits";
import { ethers } from "ethers";
import CredibleABI from "../abis/CredibleABI.json";

const CONTRACT_ADDRESS = "0x18bd11044Da9183c07D8Ff7579a5161D9E6f87b9";

export default function Profile() {
  const { walletAddress } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [credibleScore, setCredibleScore] = useState(null);
  const [user, setUser] = useState(null);
  const [license, setLicense] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHashValid, setIsHashValid] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const safeJson = async (res) => {
      try {
        return await res.json();
      } catch {
        return null; // fallback if response is empty or invalid JSON
      }
    };

    const fetchUser = async () => {
      try {
        // Fetch user profile
        const [resUser, resLicense, resTransactions, resCredentials] =
          await Promise.all([
            fetch(`http://localhost:3000/users/profile/${walletAddress}`, {
              headers: {
                "Content-Type": "application/json",
                "x-wallet-address": walletAddress,
              },
            }),
            fetch(`http://localhost:3000/licenses/${walletAddress}`, {
              headers: {
                "Content-Type": "application/json",
                "x-wallet-address": walletAddress,
              },
            }),
            fetch(`http://localhost:3000/transactions/${walletAddress}`, {
              headers: {
                "Content-Type": "application/json",
                "x-wallet-address": walletAddress,
              },
            }),
            fetch(`http://localhost:3000/credentials/${walletAddress}`),
          ]);

        const dataUser = await safeJson(resUser);
        const dataLicense = await safeJson(resLicense);
        const dataTransactions = await safeJson(resTransactions);
        const dataCredentials = await safeJson(resCredentials);

        if (!dataUser) {
          setError("Failed to fetch user profile.");
        } else {
          setUser(dataUser);
          setLicense(dataLicense);
          setTransactions(dataTransactions || []);
          setCredentials(dataCredentials || []);
          verifyHash(dataUser);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCredibleScore = async () => {
      if (!window.ethereum) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CredibleABI,
          signer,
        );
        const broker = await contract.getBroker(walletAddress);
        setCredibleScore(broker[2].toNumber()); // score
      } catch (err) {
        console.error("Error fetching on-chain score:", err);
      }
    };

    const verifyHash = async (userData) => {
      try {
        const res = await fetch("http://localhost:3000/users/verify-hash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userData.email,
            businessName: userData.business_name,
            phoneNumber: userData.phone_number,
            expectedHash: userData.profile_hash,
          }),
        });
        const data = await safeJson(res);
        setIsHashValid(data?.valid || false);
      } catch (err) {
        console.error("Error verifying hash:", err);
      }
    };

    fetchUser();
    fetchCredibleScore();
  }, [walletAddress]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="relative w-screen h-screen overflow-hidden text-[#F2AF0D]">
      {showModal && <AddCredits onClose={() => setShowModal(false)} />}

      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center opacity-[.10] z-0">
        <p className="text-[#F2AF0D] text-[6rem] font-bold mb-[-12rem] ml-[-50rem]">
          never trust claims
        </p>
        <h1 className="text-[#F2AF0D] text-[30rem] font-black">CREDIBLE</h1>
        <p className="text-[#F2AF0D] text-[6rem] font-bold mt-[-12rem] mr-[-50rem]">
          verify credibility
        </p>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between w-full h-20 px-20 pt-10">
        <img src={credibleLogo} alt="credible logo" className="h-[4rem]" />
        <img
          src={credibleLogoAlt}
          alt="credible logo with slogan"
          className="h-[4rem]"
        />
        <Link to={"/"}>
          <img src={logOutIcon} alt="log out icon" className="ml-4 h-[3rem]" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-start justify-center w-full h-full gap-3 mt-[5rem]">
        <div className="w-[75rem] h-fit">
          <NavLink className="flex flex-row gap-3 text-[#F2AF0D] text-[1rem]">
            <Link to="#">BROKER PROFILE</Link>
          </NavLink>

          {/* User Info Header */}
          <div className="flex justify-between mt-4">
            <div className="flex gap-4">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
                alt="Broker Preview"
                className="w-auto h-[5rem] border-2 border-[#F2AF0D] my-2"
              />
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-[4rem] leading-none">
                    {user.business_name}
                  </h1>
                  {isHashValid && license?.is_confirmed && (
                    <img
                      src={verifiedBadge}
                      alt="Verified Badge"
                      className="h-[2rem]"
                    />
                  )}
                </div>
                <div className="flex justify-between gap-[3rem] text-[15px] leading-none">
                  <p>
                    CREDIBLE ID:{" "}
                    <span className="text-white">CDBL-{user.credible_id}</span>
                  </p>
                  <p>
                    Email: <span className="text-white">{user.email}</span>
                  </p>
                  <p className="text-white">
                    <span className="text-[#F2AF0D]">Phone: </span>
                    {user.phone_number}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex flex-col items-center justify-center">
                <h1 className="m-0 leading-none text-white">Year Licensed</h1>
                <p className="text-5xl leading-none">
                  {license?.year_licensed?.toString().slice(0, 4) || "—"}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="m-0 leading-none text-white">
                  Total Transactions
                </h1>
                <p className="text-5xl leading-none">
                  {transactions?.length ?? 0}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="m-0 leading-none text-white">Credipoints</h1>
                <p className="text-5xl leading-none">{credibleScore ?? "-"}</p>
              </div>
              <button
                className="px-3 py-1 text-white bg-[#F2AF0D] rounded mt-1 self-end text-xs"
                onClick={() => setShowModal(true)}
              >
                Add Credits
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* Content Cards */}
          <div className="flex flex-row w-full gap-7 h-fit">
            <BrokerStatCard
              license={license}
              transactions={transactions}
              credentials={credentials}
              credibleScore={credibleScore}
            />
            <BrokerActivityCard
              license={license}
              transactions={transactions}
              credentials={credentials}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

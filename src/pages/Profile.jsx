import React, { useEffect, useState } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import credibleLogo from "../assets/credible_logo.png";
import credibleLogoAlt from "../assets/logo_w_slogan.png";
import logOutIcon from "../assets/logout_icon.png";
import verifiedBadge from "../assets/verified_icon.png";
import BrokerStatCard from "../components/BrokerStatCard";
import BrokerActivityCard from "../components/BrokerActivityCard";

export default function Profile() {
  const { walletAddress } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHashValid, setIsHashValid] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/users/profile/${walletAddress}`,
          {
            headers: {
              "Content-Type": "application/json",
              // Optionally send walletAddress in headers for middleware
              "x-wallet-address": walletAddress,
            },
          },
        );

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          verifyHash(data); // verify hash after fetching
        } else {
          setError(data.error || "Failed to fetch user");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
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

        const data = await res.json();
        setIsHashValid(data.valid);
      } catch (err) {
        console.error("Error verifying hash", err);
      }
    };

    if (walletAddress) fetchUser();
  }, [walletAddress]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="relative w-screen h-screen overflow-hidden text-[#F2AF0D]">
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
        <img src={logOutIcon} alt="log out icon" className="ml-4 h-[3rem]" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-start justify-center w-full h-full gap-3 mt-[5rem]">
        <div className="w-[75rem] h-fit">
          <NavLink className="flex flex-row gap-3 text-[#F2AF0D] text-[1rem]">
            <Link to="/profile">PROFILE</Link>
            <p>|</p>
            <Link to="/" className="opacity-50">
              HISTORY
            </Link>
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
                  {isHashValid && (
                    <img
                      src={verifiedBadge}
                      alt="Verified Badge"
                      className="h-[2rem]"
                    />
                  )}
                </div>
                <div className="flex justify-end gap-[3rem] text-[15px] leading-none">
                  <p>
                    Email: <span className="text-white">{user.email}</span>
                  </p>
                  <p>
                    CREDIBLE ID:{" "}
                    <span className="text-white">cdb-{user.credible_id}</span>
                  </p>
                  <p className="text-white">
                    <span className="text-[#F2AF0D]">Phone:</span>{" "}
                    {user.phone_number}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex flex-col items-center justify-center">
                <h1 className="m-0 leading-none text-white">Year Passed</h1>
                <p className="text-5xl leading-none">
                  {new Date().getFullYear() -
                    new Date(user.registered_at).getFullYear()}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="m-0 leading-none text-white">
                  Total Transactions
                </h1>
                <p className="text-5xl leading-none">214</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="m-0 leading-none text-white">Credipoints</h1>
                <p className="text-5xl leading-none">1849</p>
              </div>
              <button className="px-3 py-1 text-white bg-[#F2AF0D] rounded mt-1 self-end text-xs">
                EDIT PROFILE
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* Content Cards */}
          <div className="flex flex-row w-full gap-7 h-fit">
            <BrokerStatCard />
            <BrokerActivityCard />
          </div>
        </div>
      </main>
    </div>
  );
}

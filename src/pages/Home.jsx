import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:3000/users/search?name=${encodeURIComponent(
            searchTerm,
          )}`,
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "User not found");
          return;
        }

        if (!data.wallet_address) {
          setError("No broker found with that name");
          return;
        }

        // Redirect to the broker profile page
        navigate(`/broker/${data.wallet_address}`);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while searching");
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
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

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center w-full h-full gap-3">
        <h1 className="text-[#F2AF0D] text-[6rem] font-bold">can i trust</h1>
        <input
          type="text"
          placeholder="broker id | name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="text-[5rem] text-[#FFFF] font-bold border-b-[5px] border-[#F2AF0D] bg-transparent focus:outline-none text-center w-[50rem]"
        />
        <h1
          className="text-[#F2AF0D] text-[6rem] font-bold"
          onClick={() => navigate(`/broker/${searchTerm}`)}
        >
          ?
        </h1>
        {error && (
          <p className="relative text-red-500 -bottom-20 right-[30rem]">
            {error}
          </p>
        )}
      </main>

      <Link
        to="/connect-wallet"
        className="absolute z-10 text-white bottom-10 right-10"
      >
        Login As Broker
      </Link>
    </div>
  );
}

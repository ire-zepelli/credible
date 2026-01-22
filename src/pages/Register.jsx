import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import img from "../assets/business.png";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const walletAddress = searchParams.get("walletAddress");

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!businessName) {
      setError("Business name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send only the user data to the backend, hash is handled server-side
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          businessName,
          email,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to profile page after successful registration
        navigate(`/profile/${walletAddress}`);
      } else {
        setError(data.error || "Failed to register.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#1F1E1F]">
      <div className="flex flex-col">
        <h1 className="text-[#F2AF0D] text-[4rem] leading-none">Credible</h1>
        <div className="flex flex-row w-fit">
          <img src={img} alt="business" className="h-[34rem]" />
          <div className="bg-[#252525] w-[45rem] flex flex-col p-10">
            <h1 className="text-white">
              Your information is requested to enhance accuracy, maintain
              transparency, and establish trust with everyone involved in the
              process.
            </h1>

            <div className="flex flex-row flex-wrap gap-10 mt-6 text-white">
              <div className="flex flex-col">
                <label htmlFor="name">Business Name: </label>
                <input
                  type="text"
                  id="name"
                  className="text-black w-[15rem]"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email">Email: </label>
                <input
                  type="text"
                  id="email"
                  className="text-black w-[15rem]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone">Phone: </label>
                <input
                  type="text"
                  id="phone"
                  className="text-black w-[15rem]"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="mt-2 text-red-500">{error}</p>}

            <button
              onClick={handleSubmit}
              className="px-3 py-1 text-white bg-[#F2AF0D] rounded mt-1 self-end text-lg"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Homepage(props) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col w-full items-center mt-10 space-y-8">
        <div className="flex flex-row space-x-8">
          <button className="btn" onClick={() => navigate("/donate")}>
            Donate
          </button>
        </div>
        <div className="flex flex-row space-x-8">
          <button className="btn" onClick={() => navigate("/track-product")}>
            Track Product Status
          </button>
        </div>
        <p className="font-semibold">NGO/Govt.</p>
        <div className="flex flex-row space-x-8">
          <button className="btn" onClick={() => navigate("/login-org")}>
            Login for NGO/Govt.
          </button>

          <button className="btn" onClick={() => navigate("/register-org")}>
            Register a NGO/Govt.
          </button>
        </div>
        <p className="font-semibold">Storage Facilities</p>
        <div className="flex flex-row space-x-8">
          <button
            className="btn"
            onClick={() => navigate("/login-sfacility")}
          >
            Login for Storage Facilities
          </button>

          <button
            className="btn"
            onClick={() => navigate("/register-sfacility")}
          >
            Register a Storage Facility
          </button>
        </div>
        <p className="font-semibold">Distributors</p>
        <div className="flex flex-row space-x-8">
          <button
            className="btn"
            onClick={() => navigate("/login-distributor")}
          >
            Login for Distributor
          </button>

          <button
            className="btn"
            onClick={() => navigate("/register-distributor")}
          >
            Register a Distributor
          </button>
        </div>
      </div>
    </>
  );
}

export default Homepage;

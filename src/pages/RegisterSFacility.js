import React, { useState, useEffect } from "react";

function RegisterSFacility(props) {
  const [formData, setFormData] = useState({
    name: "",
    type: "ngo",
    username: "",
    password: "",
  });

  const handleInput = (field, e) => {
    setFormData({
      ...formData,
      [field]: e.currentTarget.value,
    });
  };

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.value,
    });
  };

  return (
    <>
      <div className="flex flex-col items-center mt-10">
        <p className="font-bold py-6">Register a Storage Facility</p>
        <form className="grid grid-cols-3 gap-4 mb-4 items-center">
          <label className="col-start-1 col-span-1 text-gray-700">
            Storage Facility Name:
          </label>
          <input
            type="text"
            placeholder="Enter Storage Facility Name"
            className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8"
            onInputCapture={(e) => handleInput("name", e)}
            value={formData.name}
          />
          <label className="col-start-1 col-span-1 text-gray-700">
            Username:
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8"
            onInputCapture={(e) => handleInput("username", e)}
            value={formData.username}
          />
          <label className="col-start-1 col-span-1 text-gray-700">
            Password:
          </label>
          <input
            type="text"
            placeholder="Enter Password"
            className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8"
            onInputCapture={(e) => handleInput("password", e)}
            value={formData.password}
          />
        </form>
        {props.appState.account === "" ? (
          <button className="btn" onClick={() => props.setUpWeb3()}>
            Connect Wallet before donating
          </button>
        ) : (
          <p>Connected: {props.appState.account}</p>
        )}
        <button
          className="btn mt-4"
          onClick={async () => {
            if (props.appState.account === "") {
              alert("Please connect wallet first");
              return;
            } else {
              console.log("Registering..", formData);
              await props.registerSFacility(
                formData.name,
                formData.username,
                formData.password,
                formData.type
              );
            }
          }}
        >
          Register
        </button>
      </div>
    </>
  );
}

export default RegisterSFacility;

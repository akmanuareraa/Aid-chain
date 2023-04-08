import React, { useState } from "react";

function Donate(props) {
  const [formData, setFormData] = useState({
    pname: "",
    pquantity: "",
    dname: "",
    mno: "",
  });

  const handleInput = (field, e) => {
    setFormData({
      ...formData,
      [field]: e.currentTarget.value,
    });
  };

  return (
    <>
      <div className="flex flex-col items-center py-20">
        <p className="font-bold py-6">Donate</p>
        <div className="flex flex-col space-y-4 items-center">
          <form className="grid grid-cols-3 gap-4 mb-4">
            <label className="col-start-1 col-span-1 text-gray-700">
              Product Name:
            </label>
            <input
              type="text"
              placeholder="Product Name"
              className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8"
              onInputCapture={(e) => handleInput("pname", e)}
              value={formData.pname}
            />
            <label className="col-start-1 col-span-1 text-gray-700">
              Quantity:
            </label>
            <input
              type="text"
              placeholder="Enter Product Quantity"
              className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8 "
              onInputCapture={(e) => handleInput("pquantity", e)}
              value={formData.pquantity}
            />
            <label className="col-start-1 col-span-1 text-gray-700">
              Enter Donor Name:
            </label>
            <input
              type="text"
              placeholder="Enter Donor Name"
              className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8 "
              onInputCapture={(e) => handleInput("dname", e)}
              value={formData.dname}
            />
            <label className="col-start-1 col-span-1 text-gray-700">
              Enter Mobile No.
            </label>
            <input
              type="text"
              placeholder="Enter your Mobile Number"
              className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8 "
              onInputCapture={(e) => handleInput("mno", e)}
              value={formData.mnno}
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
            className="btn"
            onClick={() => {
              if (props.appState.account === "") {
                alert("Please connect your wallet first");
              } else {
                props.registerProduct(
                  formData.pname,
                  formData.pquantity,
                  formData.dname,
                  formData.mno
                );
              }
            }}
          >
            Donate
          </button>
        </div>
      </div>
    </>
  );
}

export default Donate;

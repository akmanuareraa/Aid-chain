import React, { useState, useEffect } from "react";

function Tracker(props) {
  const [formData, setFormData] = useState({
    pid: null,
  });

  const handleInput = (field, e) => {
    setFormData({
      ...formData,
      [field]: e.currentTarget.value,
    });
  };

  useEffect(() => {
    props.setTrackedProduct(null);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center mt-10">
        <p className="font-bold py-6">Track Product</p>
        <form className="grid grid-cols-3 gap-4 mb-4 items-center">
          <label className="col-start-1 col-span-1 text-gray-700">
            Product ID:
          </label>
          <input
            type="text"
            placeholder="Enter Product ID"
            className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8"
            onInputCapture={(e) => handleInput("pid", e)}
            value={formData.pid}
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
              console.log("Tracking..", formData);
              await props.getProductByIdFromContract(formData.pid);
            }
          }}
        >
          Track Product
        </button>

        {props.trackedProduct?.productId && props.trackedProduct?.productId !== "0" ? (
          <div className="flex flex-col items-center space-y-2">
            <p className="text-xl font-bold py-6 mt-4">Product Details</p>
            <p>
              Product ID:
              <span className="text-custom-primary">
                <b> &nbsp;{props.trackedProduct.productId}</b>
              </span>
            </p>
            <p>
              Product Name:
              <span className="text-custom-primary">
                <b> &nbsp;{props.trackedProduct.productName}</b>
              </span>
            </p>
            <p>
              Product Quantity:
              <span className="text-custom-primary">
                <b> &nbsp;{props.trackedProduct.productQuantity}</b>
              </span>
            </p>
            <p>
              Donor Name:
              <span className="text-custom-primary">
                <b> &nbsp;{props.trackedProduct.dName}</b>
              </span>
            </p>
            <p>
              Date of Donation:
              <span className="text-custom-primary">
                <b> &nbsp;{props.formatDate(props.trackedProduct.date)}</b>
              </span>
            </p>
            <div className="flex flex-row space-x-8">
              <p>
                Organization Code: &nbsp;
                <span className="text-custom-primary">
                  {props.trackedProduct.orgCode === "0"
                    ? "--"
                    : props.trackedProduct.orgCode}
                </span>
              </p>
              <p>
                Storage Facility Code:&nbsp;
                <span className="text-custom-primary">
                  {props.trackedProduct.sFacilityCode === "0"
                    ? "--"
                    : props.trackedProduct.sFacilityCode}
                </span>
              </p>
              <p>
                Distributor Code:&nbsp;
                <span className="text-custom-primary">
                  {props.trackedProduct.distributorCode === "0"
                    ? "--"
                    : props.trackedProduct.distributorCode}
                </span>
              </p>
            </div>
            <div className="flex flex-row items-center pt-4">
              <span className="text-2xl font-semibold text-custom-primary">
                Status: &nbsp;
              </span>
              <b>
                {props.trackedProduct.productStatus === "0"
                  ? "Donated. Waiting for approval from an NGO/Govt. Organization"
                  : props.trackedProduct.productStatus === "1"
                  ? "Approved by NGO/Govt. Organization. Waiting for approval from Storage Facility"
                  : props.trackedProduct.productStatus === "11"
                  ? "Denied by NGO/Govt. Organization"
                  : props.trackedProduct.productStatus === "2"
                  ? "Approved by Storage Facility. Waiting for approval from Distributor"
                  : props.trackedProduct.productStatus === "22"
                  ? "Denied by Storage Facility"
                  : props.trackedProduct.productStatus === "3"
                  ? "Approved and Delivered by Distributor"
                  : props.trackedProduct.productStatus === "33"
                  ? "Denied by Distributor"
                  : "Unknown"}
              </b>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Tracker;

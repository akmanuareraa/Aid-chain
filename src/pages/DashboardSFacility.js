import React, { useState, useEffect } from "react";

function DashboardSFacility(props) {
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [formData, setFormData] = useState({});

  let dCode = {};

  const handleInput = (id, e) => {
    const value = e.currentTarget.value;
    console.log("Handling input..", value);
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    dCode[id] = value;
  };

  const processProducts = async () => {
    setFilteredProducts([]);
    console.log("Processing products..");
    let filteredProducts = [];
    for (let i = 0; i < props.allProducts.length; i++) {
      console.log("Processing products..", props.allProducts[i].pName);
      let product = props.allProducts[i];
      if (product.productStatus === "1") {
        let component = (
          <div className="flex flex-row rounded-lg bg-custom-secondary p-4 w-[800px] justify-between">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <p className="font-semibold text-2xl">{product.pName}</p>
                <p className="">
                  <b>Qty: </b>
                  {product.pQuantity}
                </p>
              </div>
              <div className="flex flex-col mt-4">
                <p className="">
                  <b>Donated By</b>: {product.dName}&nbsp;&nbsp;
                  <span>
                    <i>
                      (
                      {product.account.slice(0, 8) +
                        "..." +
                        product.account.slice(-4)}
                      )
                    </i>
                  </span>
                </p>
                <p className="">
                  <b>Date</b>: {props.formatDate(product.date)}
                </p>
                <p className="">
                  <b>ID</b>: {product.productId}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col space-y-4 ">
                <input
                  type="text"
                  placeholder="Enter Distributor Code"
                  className="col-start-2 col-span-2 px-3 border border-gray-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8"
                  onInputCapture={(e) => handleInput(product.productId, e)}
                  // value={formData[product.productId]}
                />
                <button
                  className="btn"
                  // eslint-disable-next-line no-loop-func
                  onClick={() => {
                    console.log(
                      "Approving product..",
                      product.productId,
                      "2",
                      dCode[product.productId]
                    );
                    props.approveOrDenyProduct(
                      product.productId,
                      "2",
                      dCode[product.productId]
                    );
                  }}
                >
                  Approve
                </button>
                <button
                  className="btn"
                  // eslint-disable-next-line no-loop-func
                  onClick={() => {
                    props.approveOrDenyProduct(
                      product.productId,
                      "22",
                      dCode[product.productId]
                    );
                  }}
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        );
        filteredProducts.push(component);
        setFilteredProducts(filteredProducts);
      }
    }
  };
  useEffect(() => {
    processProducts();
  }, [props.allProducts]);

  return (
    <>
      <div className="flex flex-col items-center mt-4">
        <p className="font-bold py-6">Dashboard</p>
        <button
          className="btn mb-4"
          onClick={async () => {
            props.getAllProductsFromDB();
          }}
        >
          Refresh Data
        </button>
        <div className="flex flex-col items-center space-y-4">
          {/* // ========= */}
          {filteredProducts.length === 0 ? "No products to display" : null}
          {filteredProducts}
        </div>
      </div>
    </>
  );
}

export default DashboardSFacility;

import React, { useState, useEffect } from "react";

function DashboardOrg(props) {
  const [filteredProducts, setFilteredProducts] = useState([]);

  const processProducts = async () => {
    setFilteredProducts([]);
    console.log("Processing products..");
    let filteredProducts = [];
    for (let i = 0; i < props.allProducts.length; i++) {
      console.log("Processing products..", props.allProducts[i].pName);
      let product = props.allProducts[i];
      if (product.productStatus === "0") {
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
              <div className="flex flex-col space-y-4 mt-4">
                <button
                  className="btn"
                  onClick={() => {
                    props.approveOrDenyProduct(product.productId, "1", "");
                  }}
                >
                  Approve
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    props.approveOrDenyProduct(product.productId, "11", "");
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
          {/* <div className="flex flex-row rounded-lg bg-custom-secondary p-4 w-[800px] justify-between">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <p className="font-semibold text-2xl">Bread</p>
                <p className="">
                  <b>Qty: </b>
                  500
                </p>
              </div>
              <div className="flex flex-col mt-4">
                <p className="">
                  <b>Donated By</b>: Manu (0x1234)
                </p>
                <p className="">
                  <b>Date</b>: 02 Apr 2023
                </p>
                <p className="">
                  <b>ID</b>: 45
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col space-y-4 mt-4">
                <button className="btn">Approve</button>
                <button className="btn">Deny</button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default DashboardOrg;

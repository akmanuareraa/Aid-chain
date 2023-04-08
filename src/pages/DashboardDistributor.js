import React, { useState, useEffect } from "react";

function DashboardDistributor(props) {
  const [filteredProducts, setFilteredProducts] = useState([]);

  const processProducts = async () => {
    setFilteredProducts([]);
    console.log("Processing products..");
    let filteredProducts = [];
    for (let i = 0; i < props.allProducts.length; i++) {
      console.log(
        "Processing products..",
        props.allProducts[i].pName,
        props.allProducts[i].productStatus,
        props.allProducts[i].distributorCode,
        props.loggedInParty.orgId
      );
      let product = props.allProducts[i];
      if (
        product.productStatus === "2" &&
        product.distributorCode === props.loggedInParty.orgId.toString()
      ) {
        let component = (
          <div className="flex flex-row rounded-lg bg-custom-secondary p-4 w-[800px] justify-between">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <p className="font-semibold text-2xl">{product.pName} </p>
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
                    props.approveOrDenyProduct(product.productId, "3", "");
                  }}
                >
                  Deliver
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    props.approveOrDenyProduct(product.productId, "33", "");
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

export default DashboardDistributor;

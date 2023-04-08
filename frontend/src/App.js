import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";

import Loading from "./components/Loading";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Donate from "./pages/Donate";
import contractabi from "./smart-contract/contractabi";
import Tracker from "./pages/Tracker";
import RegisterOrg from "./pages/RegisterOrg";
import LoginOrg from "./pages/LoginOrg";
import DashboardOrg from "./pages/DashboardOrg";
import LoginSFacility from "./pages/LoginSFacility";
import RegisterSFacility from "./pages/RegisterSFacility";
import RegisterDistributor from "./pages/RegisterDistributor";
import LoginDistributor from "./pages/LoginDistributor";
import DashboardDistributor from "./pages/DashboardDistributor";
import DashboardSFacility from "./pages/DashboardSFacility";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    loading: false,
    message: "",
  });
  const [appState, setAppState] = useState({
    loggedIn: false,
    web3: null,
    account: "",
    chainId: "",
    maticBalance: "",
    username: "",
    contractAddress: "0x6b0D2eB8fF7A448f1125234f12B10F394f398010",
    backendServer: "https://nodejs-production-809e.up.railway.app",
    productCount: 0,
    orgCount: 0,
    sFacilityCount: 0,
    distributorCount: 0,
  });
  const [trackedProduct, setTrackedProduct] = useState({
    pid: null,
  });
  const [loggedInParty, setLoggedInParty] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  const setUpWeb3 = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading({
          loading: true,
          message: "Connecting to Metamask...",
        });
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setAppState((prevState) => {
          return { ...prevState, web3: web3 };
        });
        console.log("<< Web3 Object Received  >>");

        window.ethereum
          .request({ method: "net_version" })
          .then(async (chainId) => {
            if (chainId !== "80001") {
              try {
                await window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0x13881" }],
                });
                console.log("Polygon Mumbai Chain found.");
              } catch (switchError) {
                console.log("Error connecting to Polygon Mumbai Chain (1)");
              }
            }
          });

        const accounts = await web3.eth.getAccounts();
        console.log("<< Account Received  >>", accounts[0]);

        setAppState((prevState) => {
          return {
            ...prevState,
            account: accounts[0],
          };
        });
        setLoading({
          loading: false,
          message: "Connecting to Metamask...",
        });
      } catch (error) {
        console.error(error);
        console.log("Error getting web3 object. Install Metamask.");
        setLoading({
          loading: false,
          message: "Connecting to Metamask...",
        });
      }
    } else {
      console.log("Please install MetaMask to connect your wallet.");
    }
  };

  const walletLogout = async () => {
    console.log("<< Wallet Logout Called  >>");
    setAppState((prevState) => {
      return {
        ...prevState,
        loggedIn: false,
        username: "",
      };
    });
    navigate("/");
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const registerProduct = async (pName, pQuantity, dName, mNo) => {
    setLoading({
      loading: true,
      message: "Donating and Registering product in Blockchain...",
    });
    console.log("<< Register Product Called  >>", pName, pQuantity, dName, mNo);

    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    const date = Math.floor(Date.now() / 1000);
    await contract.methods
      .regsiterProduct(
        pName,
        pQuantity,
        appState.productCount + 1,
        date.toString(),
        dName,
        mNo
      )
      .send({ from: appState.account })
      .then(async (response) => {
        setLoading({
          loading: true,
          message: "Transaction Successful. Storing data in Database...",
        });
        console.log("<< Response from contract: ", response);

        const productDetails = {
          pName: pName,
          pQuantity: pQuantity,
          dName: dName,
          mNo: mNo,
          date: date,
          account: appState.account,
          productId: appState.productCount + 1,
          productStatus: 0,
          orgCode: 0,
          sFacilityCode: 0,
          distributorCode: 0,
        };

        await axios
          .post(`${appState.backendServer}/registerProduct`, productDetails)
          .then((response) => {
            console.log("<< Response from backend server: ", response);
            setLoading({
              loading: false,
              message: "Registering product in Blockchain...",
            });
            alert("Product Donted Successfully");
          })
          .catch((error) => {
            setLoading({
              loading: false,
              message: "Registering product in Blockchain...",
            });
            console.log("<< Error from backend server: ", error);
          });
      })
      .catch((error) => {
        console.log("<< Error from contract: ", error);
        setLoading({
          loading: false,
          message: "Registering product in Blockchain...",
        });
      });
  };

  const getAllMetadata = async () => {
    console.log("<< Get Product Metadata Called  >>");

    const response = await axios
      .get(`${appState.backendServer}/getAllMetadata`)
      .then((response) => {
        console.log(
          "<< Response from backend server - getAllMetadata: ",
          response.data
        );
        setAppState((prevState) => {
          return {
            ...prevState,
            productCount: response.data.productCount,
            orgCount: response.data.orgCount,
            sFacilityCount: response.data.sFacilityCount,
            distributorCount: response.data.distributorCount,
          };
        });
      })
      .catch((error) => {
        console.log("<< Error from backend server - getAllMetadata: ", error);
      });
  };

  const getProductById = async (id) => {
    console.log("<< Get Product By Id Called  >>");

    axios
      .get(`${appState.backendServer}/getAllMetadata`, {
        params: { productId: id },
      })
      .then((response) => {
        console.log(
          "<< Response from backend server - getAllMetadata: ",
          response.data
        );
        return response.data;
      })
      .catch((error) => {
        console.log("<< Error from backend server - getAllMetadata: ", error);
      });
  };

  const getProductByIdFromContract = async (id) => {
    setLoading({
      loading: true,
      message: "Fetching product details from Blockchain...",
    });
    console.log("<< Get Product By Id from Contract Called  >>");

    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .products(id)
      .call()
      .then((response) => {
        console.log("<< Response from contract: ", response);
        setTrackedProduct(response);
        setLoading({
          loading: false,
          message: "Fetching product details from Blockchain...",
        });
      })
      .catch((error) => {
        setLoading({
          loading: false,
          message: "Fetching product details from Blockchain...",
        });
        console.log("<< Error from contract: ", error);
      });
  };

  const getAllProductsFromDB = async () => {
    setLoading({
      loading: true,
      message: "Fetching Product data...",
    });
    console.log("<< Get All Products from DB Called  >>");

    axios
      .get(`${appState.backendServer}/getAllProducts`)
      .then((response) => {
        console.log(
          "<< Response from backend server - getAllProducts: ",
          response.data
        );
        setAllProducts(response.data.products);
        setLoading({
          loading: false,
          message: "Logging In...",
        });
      })
      .catch((error) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log("<< Error from backend server - getAllProducts: ", error);
      });
  };

  const registerOrg = async (name, username, password, type) => {
    setLoading({
      loading: true,
      message: "Registering New Organization...",
    });
    console.log("<< Register Org Called  >>", name, username, password, type);

    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .registerNgoGovOrg(name, type, appState.orgCount + 1)
      .send({ from: appState.account })
      .then(async (response) => {
        console.log("<< Response from contract: ", response);

        const orgDetails = {
          name: name,
          username: username,
          password: password,
          type: type,
          account: appState.account,
          orgId: appState.orgCount + 1,
        };

        await axios
          .post(`${appState.backendServer}/registerOrg`, orgDetails)
          .then((response) => {
            setLoading({
              loading: false,
              message: "Fetching product details from Blockchain...",
            });
            console.log("<< Response from backend server: ", response);
            navigate("/login-org");
          })
          .catch((error) => {
            setLoading({
              loading: false,
              message: "Fetching product details from Blockchain...",
            });
            console.log("<< Error from backend server: ", error);
          });
      })
      .catch((error) => {
        setLoading({
          loading: false,
          message: "Fetching product details from Blockchain...",
        });
        console.log("<< Error from contract: ", error);
      });
  };

  const loginOrg = async (username, password) => {
    setLoading({
      loading: true,
      message: "Logging In...",
    });
    console.log("<< Login: >>", username, password);
    axios
      .post(`${appState.backendServer}/loginOrg`, {
        username: username,
        password: password,
        account: appState.account,
      })
      .then((response) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log(response.data);
        if (response.data.success === true) {
          setAppState((prevState) => {
            return {
              ...prevState,
              loggedIn: true,
            };
          });
          setLoggedInParty({
            name: response.data.org.name,
            orgId: response.data.org.orgId,
            type: response.data.org.type,
          });
          getAllProductsFromDB();
          navigate("/org-dashboard");
        }
      })
      .catch((error) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log(error);
      });
  };

  const registerSFacility = async (name, username, password) => {
    setLoading({
      loading: true,
      message: "Registering New Storage Facility...",
    });
    console.log("<< Register SFacility  Called  >>", name, username, password);

    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .registerSFacility(name, appState.sFacilityCount + 1)
      .send({ from: appState.account })
      .then(async (response) => {
        console.log("<< Response from contract: ", response);

        const orgDetails = {
          name: name,
          username: username,
          password: password,
          account: appState.account,
          orgId: appState.sFacilityCount + 1,
        };

        await axios
          .post(`${appState.backendServer}/registersSFacility`, orgDetails)
          .then((response) => {
            setLoading({
              loading: false,
              message: "Logging In...",
            });
            console.log("<< Response from backend server: ", response);
            navigate("/login-sfacility");
          })
          .catch((error) => {
            setLoading({
              loading: false,
              message: "Logging In...",
            });
            console.log("<< Error from backend server: ", error);
          });
      })
      .catch((error) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log("<< Error from contract: ", error);
      });
  };

  const loginSFacility = async (username, password) => {
    setLoading({
      loading: true,
      message: "Logging In...",
    });
    console.log("<< Login: >>", username, password);
    axios
      .post(`${appState.backendServer}/loginSFacility`, {
        username: username,
        password: password,
        account: appState.account,
      })
      .then((response) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log(response.data);
        if (response.data.success === true) {
          setAppState((prevState) => {
            return {
              ...prevState,
              loggedIn: true,
            };
          });
          setLoggedInParty({
            name: response.data.org.name,
            orgId: response.data.org.orgId,
          });
          getAllProductsFromDB();
          navigate("/sfacility-dashboard");
        }
      })
      .catch((error) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log(error);
      });
  };

  const registerDistributor = async (name, username, password, type, area) => {
    setLoading({
      loading: true,
      message: "Registering New Distributor...",
    });
    console.log(
      "<< Register Distributor Called  >>",
      name,
      username,
      password,
      type
    );

    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    await contract.methods
      .registerDistributor(name, type, area, appState.distributorCount + 1)
      .send({ from: appState.account })
      .then(async (response) => {
        console.log("<< Response from contract: ", response);

        const orgDetails = {
          name: name,
          username: username,
          password: password,
          type: type,
          area: area,
          account: appState.account,
          orgId: appState.distributorCount + 1,
        };

        await axios
          .post(`${appState.backendServer}/registerDistributor`, orgDetails)
          .then((response) => {
            setLoading({
              loading: false,
              message: "Logging In...",
            });
            console.log("<< Response from backend server: ", response);
            navigate("/login-distributor");
          })
          .catch((error) => {
            setLoading({
              loading: false,
              message: "Logging In...",
            });
            console.log("<< Error from backend server: ", error);
          });
      })
      .catch((error) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log("<< Error from contract: ", error);
      });
  };

  const loginDistributor = async (username, password) => {
    setLoading({
      loading: true,
      message: "Logging In...",
    });
    console.log("<< Login: >>", username, password);
    axios
      .post(`${appState.backendServer}/loginDistributor`, {
        username: username,
        password: password,
        account: appState.account,
      })
      .then((response) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log(response.data);
        if (response.data.success === true) {
          setAppState((prevState) => {
            return {
              ...prevState,
              loggedIn: true,
            };
          });
          setLoggedInParty({
            name: response.data.org.name,
            orgId: response.data.org.orgId,
          });
          getAllProductsFromDB();
          navigate("/distributor-dashboard");
        }
      })
      .catch((error) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log(error);
      });
  };

  const updateProductInDatabase = async (productId, statusCode, toCode) => {
    setLoading({
      loading: true,
      message: "Updating Product Data...",
    });
    console.log(
      "<< Update Product In Database Called  >>",
      productId,
      statusCode,
      toCode
    );

    const productDetails = {
      statusCode: statusCode.toString(),
      productId: productId.toString(),
      fromCode: loggedInParty.orgId.toString(),
      toCode: toCode.toString(),
    };

    await axios
      .post(`${appState.backendServer}/approveOrDenyProduct`, productDetails)
      .then((response) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log("<< Response from backend server: ", response);
        getAllProductsFromDB();
        alert("Product Status Updated Successfully");
      })
      .catch((error) => {
        setLoading({
          loading: false,
          message: "Logging In...",
        });
        console.log("<< Error from backend server: ", error);
      });
  };

  const approveOrDenyProduct = async (productId, statusCode, toCode) => {
    setLoading({
      loading: true,
      message: "Updating the Status of the Product...",
    });
    console.log(
      "<< Approve Or Deny Product Called !! >>",
      productId,
      statusCode,
      toCode
    );

    const web3 = appState.web3;
    const contract = new web3.eth.Contract(
      JSON.parse(contractabi),
      appState.contractAddress
    );

    if (statusCode === "1" || statusCode === "11") {
      console.log(
        "Calling SC with params [1]",
        productId,
        statusCode,
        loggedInParty.orgId
      );

      await contract.methods
        .approveOrDenyProductForNGO(productId, statusCode, loggedInParty.orgId)
        .send({ from: appState.account })
        .then(async (response) => {
          setLoading({
            loading: false,
            message: "Logging In...",
          });
          console.log("<< Response from contract: ", response);
          updateProductInDatabase(productId, statusCode, toCode);
        })
        .catch((error) => {
          setLoading({
            loading: false,
            message: "Logging In...",
          });
          console.log("<< Error from contract: ", error);
        });
    } else if (statusCode === "2" || statusCode === "22") {
      console.log(
        "Calling SC with params",
        productId,
        statusCode,
        toCode,
        loggedInParty.orgId
      );
      await contract.methods
        .approveOrDenyForStorageFacility(
          productId,
          statusCode,
          toCode,
          loggedInParty.orgId
        )
        .send({ from: appState.account })
        .then(async (response) => {
          setLoading({
            loading: false,
            message: "Logging In...",
          });
          console.log("<< Response from contract: ", response);
          updateProductInDatabase(productId, statusCode, toCode);
        })
        .catch((error) => {
          setLoading({
            loading: false,
            message: "Logging In...",
          });
          console.log("<< Error from contract: ", error);
        });
    } else if (statusCode === "3" || statusCode === "33") {
      console.log(
        "Calling SC with params [3]",
        productId,
        statusCode,
        toCode,
        loggedInParty.orgId
      );
      await contract.methods
        .approveOrDenyForDistributor(productId, statusCode)
        .send({ from: appState.account })
        .then(async (response) => {
          setLoading({
            loading: false,
            message: "Logging In...",
          });
          console.log("<< Response from contract: ", response);
          updateProductInDatabase(productId, statusCode, toCode);
        })
        .catch((error) => {
          setLoading({
            loading: false,
            message: "Logging In...",
          });
          console.log("<< Error from contract: ", error);
        });
    }
  };

  useEffect(() => {
    getAllMetadata();
  }, []);

  return (
    <>
      <div className="h-screen">
        {loading.loading === true ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : null}

        <Header appState={appState} loggedInParty={loggedInParty} />
        <Navbar appState={appState} walletLogout={walletLogout} />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/donate"
            element={
              <Donate
                appState={appState}
                setUpWeb3={setUpWeb3}
                registerProduct={registerProduct}
              />
            }
          />
          <Route
            path="/track-product"
            element={
              <Tracker
                appState={appState}
                setUpWeb3={setUpWeb3}
                getProductById={getProductById}
                getProductByIdFromContract={getProductByIdFromContract}
                trackedProduct={trackedProduct}
                setTrackedProduct={setTrackedProduct}
                formatDate={formatDate}
              />
            }
          />
          <Route
            path="/register-org"
            element={
              <RegisterOrg
                appState={appState}
                setUpWeb3={setUpWeb3}
                registerOrg={registerOrg}
              />
            }
          />
          <Route
            path="/login-org"
            element={
              <LoginOrg
                appState={appState}
                setUpWeb3={setUpWeb3}
                loginOrg={loginOrg}
              />
            }
          />
          <Route
            path="/org-dashboard"
            element={
              <DashboardOrg
                appState={appState}
                allProducts={allProducts}
                formatDate={formatDate}
                approveOrDenyProduct={approveOrDenyProduct}
                getAllProductsFromDB={getAllProductsFromDB}
              />
            }
          />
          <Route
            path="/login-sfacility"
            element={
              <LoginSFacility
                appState={appState}
                setUpWeb3={setUpWeb3}
                loginSFacility={loginSFacility}
              />
            }
          />
          <Route
            path="/register-sfacility"
            element={
              <RegisterSFacility
                appState={appState}
                setUpWeb3={setUpWeb3}
                registerSFacility={registerSFacility}
              />
            }
          />
          <Route
            path="/sfacility-dashboard"
            element={
              <DashboardSFacility
                appState={appState}
                allProducts={allProducts}
                formatDate={formatDate}
                approveOrDenyProduct={approveOrDenyProduct}
                loggedInParty={loggedInParty}
                getAllProductsFromDB={getAllProductsFromDB}
              />
            }
          />
          <Route
            path="/register-distributor"
            element={
              <RegisterDistributor
                appState={appState}
                setUpWeb3={setUpWeb3}
                registerDistributor={registerDistributor}
              />
            }
          />
          <Route
            path="/login-distributor"
            element={
              <LoginDistributor
                appState={appState}
                setUpWeb3={setUpWeb3}
                loginDistributor={loginDistributor}
              />
            }
          />
          <Route
            path="/distributor-dashboard"
            element={
              <DashboardDistributor
                appState={appState}
                allProducts={allProducts}
                formatDate={formatDate}
                approveOrDenyProduct={approveOrDenyProduct}
                loggedInParty={loggedInParty}
                getAllProductsFromDB={getAllProductsFromDB}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;

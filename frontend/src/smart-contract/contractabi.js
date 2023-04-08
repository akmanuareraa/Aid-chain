const contractabi = `
[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_status",
				"type": "uint256"
			}
		],
		"name": "approveOrDenyForDistributor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_approval",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_distributorCode",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_sFacilityCode",
				"type": "uint256"
			}
		],
		"name": "approveOrDenyForStorageFacility",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_approval",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_orgCode",
				"type": "uint256"
			}
		],
		"name": "approveOrDenyProductForNGO",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "distributors",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "orgType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "code",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "area",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "ngoGovOrgs",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "orgType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "code",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "productQuantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "productStatus",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "ownerAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "dName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "mNo",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "date",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "orgCode",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sFacilityCode",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "distributorCode",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_orgType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_area",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_code",
				"type": "uint256"
			}
		],
		"name": "registerDistributor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_orgType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_code",
				"type": "uint256"
			}
		],
		"name": "registerNgoGovOrg",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_code",
				"type": "uint256"
			}
		],
		"name": "registerSFacility",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_productQuantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_date",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_dName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_mNo",
				"type": "string"
			}
		],
		"name": "regsiterProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "sFacilities",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "code",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
`;

export default contractabi;

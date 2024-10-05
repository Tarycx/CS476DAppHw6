


let web3;
let tokenContract;
let userAccount; 

//Contract ABI and address
const contractABI =  [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_initialSupply",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
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
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';  //Deployed contract address

//Request MetaMask account and check ownership
async function initializeWeb3() {
  if (window.ethereum) {
    try {
      //Request user accounts from MetaMask
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAccount = accounts[0];  // Use the first account
      web3 = new Web3(window.ethereum);
      
      //Initialize the contract
      tokenContract = new web3.eth.Contract(contractABI, contractAddress);

      //Display connected account
      document.getElementById('WalletAddress').textContent = `Connected: ${userAccount}`;
    } catch (error) {
      console.error("User denied account access", error);
      document.getElementById('feedback').textContent = `Error: ${error.message}`;
    }
  } else {
    alert("MetaMask is not installed. Please install MetaMask and try again.");
  }
}

//Function to check if connected account is the contract owner
async function isOwner() {
  const owner = await tokenContract.methods.owner().call();
  return owner.toLowerCase() === userAccount.toLowerCase();
}

//Mint tokens (restricted to contract owner)
async function mintTokens() {
  const amount = document.getElementById('mintAmount').value;
  try {
    const owner = await isOwner();
    if (!owner) {
      document.getElementById('mintStatus').textContent = "Error: Only the contract owner can mint tokens.";
      return;
    }
    await tokenContract.methods.mint(userAccount, web3.utils.toWei(amount, 'ether')).send({ from: userAccount });
    document.getElementById('mintStatus').textContent = "Minting Successful!";
  } catch (error) {
    document.getElementById('mintStatus').textContent = `Error: ${error.message}`;
  }
}

//Approve tokens (restricted to contract owner)
async function approveTokens() {
  const spender = document.getElementById('spenderAddress').value;
  const amount = document.getElementById('approveAmount').value;
  try {
    const owner = await isOwner();
    if (!owner) {
      document.getElementById('approvalStatus').textContent = "Error: Only the contract owner can approve tokens.";
      return;
    }
    await tokenContract.methods.approve(spender, web3.utils.toWei(amount, 'ether')).send({ from: userAccount });
    document.getElementById('approvalStatus').textContent = "Approval Successful!";
  } catch (error) {
    document.getElementById('approvalStatus').textContent = `Error: ${error.message}`;
  }
}

//Connect wallet and verify ownership upon connecting
async function connectWallet() {
  await initializeWeb3();
  const isOwnerUser = await isOwner();
  
  if (isOwnerUser) {
    document.getElementById('ownerStatus').textContent = "You are the contract owner!";
  } else {
    document.getElementById('ownerStatus').textContent = "You are not the contract owner.";
  }
}

//Get token balance
async function getBalance() {
  if (!userAccount) {
      console.log("MetaMask not connected yet.");
      document.getElementById('balance').textContent = "Please connect MetaMask.";
      return;
  }

  try {
      console.log("Fetching balance for:", userAccount);
      const balance = await tokenContract.methods.balanceOf(userAccount).call();
      const adjustedBalance = web3.utils.fromWei(balance, 'ether');  //Convert to Ether format
      console.log("Fetched balance:", adjustedBalance);  //Log the balance in Ether
      document.getElementById('balance').textContent = `Balance: ${adjustedBalance} MTK`;
  } catch (error) {
      console.error("Error fetching balance:", error);
      document.getElementById('balance').textContent = `Error fetching balance: ${error.message}`;
  }
}


//Transfer tokens
async function transferTokens() {
  const recipient = document.getElementById('recipientAddress').value;  //Ensure this ID matches your HTML
  const amount = document.getElementById('transferAmount').value;  //Ensure this ID matches your HTML
  try {
      await tokenContract.methods.transfer(recipient, web3.utils.toWei(amount, 'ether')).send({ from: userAccount });
      document.getElementById('transactionStatus').textContent = "Transfer Successful!";
  } catch (error) {
      document.getElementById('transactionStatus').textContent = `Error: ${error.message}`;
  }
}
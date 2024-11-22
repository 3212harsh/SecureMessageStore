import Web3 from 'web3';

let selectedAccount;
let web3;
let contract;

const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "MessageStored",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "storeMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieveMessage",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

const contractAddress = "0x9fd9dcD1980871b1375d67AA9E728d424231C4cB"; 

export const init = async () => {
  const provider = window.ethereum;

  if (typeof provider !== 'undefined') {
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      selectedAccount = accounts[0];
      console.log("Selected Account: ", selectedAccount);

      web3 = new Web3(provider);

      contract = new web3.eth.Contract(contractABI, contractAddress);
      console.log("Contract initialized");

      window.ethereum.on('accountsChanged', (accounts) => {
        selectedAccount = accounts[0];
        console.log("Changed account: ", selectedAccount);
      });

    } catch (error) {
      console.error("Error initializing Web3: ", error);
    }
  } else {
    console.error("Ethereum provider is not available");
  }
};

// Export selectedAccount and contract for use in other files
export { selectedAccount, contract };

export const saveMessage = async (messageContent) => {
  try {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }

    if (messageContent.length > 100) {
      console.error("Error: Message exceeds the 100-character limit.");
      return;
    }

    const accounts = await web3.eth.getAccounts();
    await contract.methods.storeMessage(messageContent).send({ from: accounts[0] });

    console.log("Message saved successfully.");
  } catch (error) {
    console.error("Error calling contract method 'saveMessage': ", error);
  }
};

export const retrieveMessage = async () => {
  try {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }

    const message = await contract.methods.retrieveMessage().call();
    console.log("Retrieved message: ", message);
    return message;
  } catch (error) {
    console.error("Error calling contract method 'retrieveMessage': ", error);
  }
};

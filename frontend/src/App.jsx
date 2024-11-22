import React, { useEffect, useState } from "react";
import { init, selectedAccount } from "./Contract/web3client"; // Import init and selectedAccount from web3client
import Header from "./components/Header";
import SaveMessage from "./components/SaveMessage";
import RetrieveMessage from "./components/RetrieveMessage";

function App() {
  const [account, setAccount] = useState(null);

  // Initialize Web3.js and get the selected account
  useEffect(() => {
    const initialize = async () => {
      await init(); // Initialize Web3.js and the contract
      setAccount(selectedAccount); // Set the account after initialization
    };
    initialize();
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      // Listen for account changes in MetaMask
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]); // Update the account in the app state
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-200">
      <Header account={account} /> {/* Pass the account to the Header component */}
      <main className="container mx-auto p-4">
        {account ? (
          <>
            <SaveMessage />
            <div className="my-4"></div>
            <RetrieveMessage />
          </>
        ) : (
          <p className="text-center text-red-500">Please connect your MetaMask account to continue.</p>
        )}
      </main>
    </div>
  );
}

export default App;

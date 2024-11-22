import React, { useState } from "react";
import { contract, selectedAccount } from "../Contract/web3client"; // Import contract and selectedAccount

const RetrieveMessage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleRetrieve = async () => {
    setError(""); // Clear previous errors
    setProcessing(true); // Set processing state
    try {
      // Ensure that the user is connected and account is available
      if (!selectedAccount) {
        setError("Please connect your MetaMask account.");
        setProcessing(false);
        return;
      }

      // Call the retrieveMessage method from the contract
      const retrievedMessage = await contract.methods.retrieveMessage().call({ from: selectedAccount });

      if (retrievedMessage) {
        setMessage(retrievedMessage); // Set the retrieved message
      } else {
        setError("No message found for this account.");
      }
    } catch (err) {
      if (err.message.includes("No message found")) {
        setError("No message found for this account.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setProcessing(false); // Reset processing state
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Retrieve Message</h2>

      <button
        onClick={handleRetrieve}
        className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300"
        }`}
        disabled={processing}
      >
        {processing ? (
          <span className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin h-5 w-5 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 2a10 10 0 0110 10H12z"
                fill="currentColor"
              />
            </svg>
            Processing...
          </span>
        ) : (
          "Retrieve Message"
        )}
      </button>

      {message && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-300">
          <p className="text-lg font-semibold">Message:</p>
          <p>{message}</p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500 font-semibold text-sm">{error}</p>
      )}
    </div>
  );
};

export default RetrieveMessage;

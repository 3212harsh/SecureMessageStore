import React, { useState } from "react";
import { contract, selectedAccount } from "../Contract/web3client"; // Import contract and selectedAccount

const SaveMessage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSave = async () => {
    setError(""); // Clear previous errors
    setProcessing(true); // Set processing state

    // Validate the message length (max 100 characters)
    if (message.length > 100) {
      setError("Message exceeds the 100-character limit.");
      setProcessing(false);
      return;
    }

    try {
      // Ensure the user is connected and selected an account
      if (!selectedAccount) {
        setError("Please connect your MetaMask account.");
        setProcessing(false);
        return;
      }

      // Call the saveMessage function on the smart contract
      await contract.methods.storeMessage(message).send({ from: selectedAccount });

      alert("Message saved successfully!"); // Notify the user on successful transaction
      setMessage(""); // Clear the message input field
    } catch (err) {
      // Handle any errors that occur during the transaction
      if (err.message.includes("User denied")) {
        setError("Transaction was denied by the user.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setProcessing(false); // Reset processing state
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Save Message</h2>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      
      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
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
          "Save Message"
        )}
      </button>
      
      {error && (
        <p className="mt-4 text-red-500 font-semibold text-sm">{error}</p>
      )}
    </div>
  );
};

export default SaveMessage;

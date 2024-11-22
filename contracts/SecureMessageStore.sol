// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageStorage {

    mapping(address => string) private messages;


    event MessageStored(address indexed user, string message);

    function storeMessage(string calldata _message) external {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(bytes(_message).length <= 100, "Message exceeds 100 characters");

        messages[msg.sender] = _message;

        emit MessageStored(msg.sender, _message);
    }

    
    function retrieveMessage() external view returns (string memory) {
        string memory userMessage = messages[msg.sender];
        require(bytes(userMessage).length > 0, "No message found for this user");

        return userMessage;
    }
}

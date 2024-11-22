const SecureMessageStore = artifacts.require("MessageStorage");

module.exports = function (deployer) {
  deployer.deploy(SecureMessageStore);
};
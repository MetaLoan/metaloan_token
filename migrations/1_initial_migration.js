const PolylendToken = artifacts.require("PolylendToken");

module.exports = function (deployer) {
  deployer.deploy(PolylendToken);
};

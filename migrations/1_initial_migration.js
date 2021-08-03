const PolylendToken = artifacts.require("PolylendToken");

module.exports = function (deployer) {
  deployer.deploy(PolylendToken, 10000*10000);  // 100 million
};

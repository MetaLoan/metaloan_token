const PolylendToken = artifacts.require("PolylendToken");
const PolylendTokenMock = artifacts.require("PolylendTokenMock");
const UpgradeToken = artifacts.require("UpgradeToken");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(PolylendToken);
  await deployer.deploy(UpgradeToken);
  await deployer.deploy(PolylendTokenMock);
};

const MetaLoanToken = artifacts.require("MetaLoanToken");
const MetaLoanTokenMock = artifacts.require("MetaLoanTokenMock");
const UpgradeToken = artifacts.require("UpgradeToken");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MetaLoanToken);
  await deployer.deploy(UpgradeToken);
  await deployer.deploy(MetaLoanTokenMock);
};

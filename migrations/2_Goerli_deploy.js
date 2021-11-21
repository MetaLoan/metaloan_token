const MetaLoanToken = artifacts.require("MetaLoanToken");

module.exports = async function (deployer, network, accounts) {
    if ( network == 'Goerli' ) {
        console.log("User=" + accounts[0]);
        await deployer.deploy(MetaLoanToken, {from: accounts[0]});

    } else if ( network == 'ropsten' ) {
        console.log("User=" + accounts[0]);
        await deployer.deploy(MetaLoanToken, {from: accounts[0]});
    }

    var MCoin = await MetaLoanToken.deployed();
    var symbol = await MCoin.symbol();
    console.log(symbol);
}
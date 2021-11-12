const PolylendToken = artifacts.require("PolylendToken");

module.exports = async function (deployer, network, accounts) {
    if ( network == 'Goerli' ) {
        console.log("User=" + accounts[0]);
        await deployer.deploy(PolylendToken, {from: accounts[0]});

    } else if ( network == 'ropsten' ) {
        console.log("User=" + accounts[0]);
        await deployer.deploy(PolylendToken, {from: accounts[0]});
    }

    var PCoin = await PolylendToken.deployed();
    var symbol = await PCoin.symbol();
    console.log(symbol);
}
const PolylendToken = artifacts.require("PolylendToken");

module.exports = async function (deployer, network, accounts) {
    if ( network == 'Goerli' ) {
        console.log("User=" + accounts[0]);
        deployer.deploy(PolylendToken, {from: accounts[0]});
        //var PCoin = await PolylendToken.at('0xC7aC3CD5721269de0CD033Be0034516e025FA8FE ');
        //var symbol = await PCoin.symbol();
        //console.log(symbol);
    }
}
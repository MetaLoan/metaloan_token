const MetaLoanToken = artifacts.require("MetaLoanToken");
const BigNumber = require("bignumber.js");

// pcoin address
let pcoin_address;

module.exports = async function (deployer, network, accounts) {
    var isMint = false;
    if ( network == 'Goerli' ) {
        mcoin_address = '0xC7aC3CD5721269de0CD033Be0034516e025FA8FE';
        isMint = true;
    }
    else if ( network == 'ropsten' ) {
        mcoin_address = '0xbB2BE7b0d2C1aEfc5B8D91E131AEED42b7360a9b';
        isMint = true;
    }

    if ( isMint ) {
        console.log("User=" + accounts[0]);
        var MCoin = await MetaLoanToken.at(mcoin_address);
        var decimals = new BigNumber(await MCoin.decimals());
        decimals = (new BigNumber(10)).exponentiatedBy(decimals);
        var byte32_MINTER_ROLE = await MCoin.MINTER_ROLE();
        var hasMintRole = await MCoin.hasRole(byte32_MINTER_ROLE, accounts[0]);
        if ( !hasMintRole ) {
            await MCoin.grantRole(byte32_MINTER_ROLE, accounts[0], {from: accounts[0]});
        }

        console.log("User=" + accounts[0] + " mint role=" + hasMintRole);
        var amount = (new BigNumber(10000)).multipliedBy(decimals);
        //console.log(amount.toNumber());
        await MCoin.mint(accounts[0], amount, {from: accounts[0]});
    }
}
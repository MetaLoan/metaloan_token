const PolylendToken = artifacts.require("PolylendToken");
const BigNumber = require("bignumber.js");
const MaticPOSClient = require('@maticnetwork/maticjs').MaticPOSClient;
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');

// pcoin address
const pcoin_address = '0xC7aC3CD5721269de0CD033Be0034516e025FA8FE';

module.exports = async function (deployer, network, accounts) {
    // for mumbai testnet
    if ( network == 'Goerli' ) {
        console.log(web3.utils);
        const privateKey = fs.readFileSync(".secret").toString().trim();
        //console.log('private key:' + privateKey);

        const parentProvider = new HDWalletProvider(privateKey, 'https://goerli.infura.io/v3/8141e840c2f4470e84c7e2d70b85a6d7');
        const maticProvider = new HDWalletProvider(privateKey, 'https://matic-mumbai.chainstacklabs.com');
        const maticPOSClient = new MaticPOSClient({
            network: "testnet",
            version: "mumbai",
            parentProvider: parentProvider,
            maticProvider: maticProvider
        });
        // console.log(maticPOSClient);
        var _allowance = new BigNumber(
            await maticPOSClient.getERC20Allowance(
                accounts[0],
                pcoin_address,
                {from: accounts[0]}
            ));
        console.log(_allowance.toNumber());
        var amount = new BigNumber('600e+18');
        if ( amount.isGreaterThan(_allowance) ) {
            console.log('approveMaxERC20ForDeposit');
            await maticPOSClient.approveMaxERC20ForDeposit(
                pcoin_address,
                {from: accounts[0]}
            );
        }

        await maticPOSClient.depositERC20ForUser(pcoin_address, accounts[0], web3.utils.toWei('6000', 'ether'),
        {
            from: accounts[0]
        }
        );
    }
}
const PolylendToken = artifacts.require("PolylendToken");
const BigNumber = require("bignumber.js");
const UpgradeToken = artifacts.require("UpgradeToken");
const PolylendTokenMock = artifacts.require("PolylendTokenMock");

let account_one;
let account_two;
let account_three;
let account_four;
let pcoinIns;
let _upgrade;
let timestamp;

let initFlag = true;

contract('MintPolicyMock', async accounts => {
  beforeEach(async () => {
    if ( initFlag ) {
        account_one = accounts[0];
        account_two = accounts[1];
        account_three = accounts[2];
        account_four = accounts[3];

        pcoinIns = await PolylendToken.deployed();

        _upgrade = await UpgradeToken.deployed();
        var name = await pcoinIns.NAME();
        var symbol = await pcoinIns.SYMBOL();
        var _initParams = [
            account_one,
            pcoinIns.address,
            name,
            symbol,
            18];

        await _upgrade.Initialize(_initParams, {from:accounts[0]});
        var proxyAddress = await _upgrade._tokenProxy();
        console.log(proxyAddress);

//        _initParams = [
//            account_two,
//            pcoinIns.address,
//            name,
//            symbol,
//            18
//        ];
        pcoinIns = await PolylendToken.at(proxyAddress);
        //await _upgrade.Initialize(_initParams, {from:accounts[0]});

        //timestamp = (await web3.eth.getBlock()).timestamp;
        initFlag = false;
    }
  });

  it('init', async() => {
      var name = await pcoinIns.name();
      var symbol = await pcoinIns.symbol();
      var decimals = (await pcoinIns.decimals()).toNumber();
      assert.equal(name, "Polylend Token");
      assert.equal(symbol, "PCOIN");
      assert.equal(decimals, 18);
      console.log(name, symbol, decimals);
      var isRole = await pcoinIns.hasRole('0x00', account_one);
      assert.equal(isRole, true);
  });

  it('mint', async() => {
    // add minter into pcoin
    var isRole = await pcoinIns.hasRole('0x00', account_one);
    assert.equal(isRole, true);
    isRole = await pcoinIns.hasRole('0x00', account_two);
    assert.equal(isRole, false);
    // test success for do not add minter and account_one is not minter
    //pcoinIns.mint(account_two, 100000);
    // add account_two to minter
    var byte32_MINTER_ROLE = await pcoinIns.MINTER_ROLE();
    await pcoinIns.grantRole(byte32_MINTER_ROLE, account_two, {from: account_one});
    await pcoinIns.mint(account_three, 100000000, {from: account_two});
    var a3_balance_0 = (await pcoinIns.balanceOf(account_three)).toNumber();
    assert.equal(a3_balance_0, 100000000);
    await pcoinIns.mint(account_four, 200000000, {from: account_two});
    var a4_balance_0 = (await pcoinIns.balanceOf(account_four)).toNumber();
    assert.equal(a4_balance_0, 200000000);
    var totalSupply_0 = (await pcoinIns.totalSupply()).toNumber();
    assert.equal(totalSupply_0, 300000000);
    var accountCounts = (await pcoinIns._accountCounts()).toNumber();
    assert.equal(accountCounts, 2);
  });

  it('burn', async() => {
    await pcoinIns.burn(100000000, {from: account_four});
    var a4_balance_0 = (await pcoinIns.balanceOf(account_four)).toNumber();
    assert.equal(a4_balance_0, 100000000);
    var totalSupply_0 = (await pcoinIns.totalSupply()).toNumber();
    assert.equal(totalSupply_0, 200000000);
    // burn exceeds balance test success
    //await pcoinIns.burn(300000000, {from: account_four});
  });

  it('transfer', async() => {
    await pcoinIns.transfer(account_one, 10000000, {from: account_three});
    var a3_balance_0 = (await pcoinIns.balanceOf(account_three)).toNumber();
    var a1_balance_0 = (await pcoinIns.balanceOf(account_one)).toNumber();
    assert.equal(a3_balance_0, 90000000);
    assert.equal(a1_balance_0, 10000000);
    var totalSupply_0 = (await pcoinIns.totalSupply()).toNumber();
    assert.equal(totalSupply_0, 200000000);
    // transfer excceds balance test success
    //await pcoinIns.transfer(account_one, 90000001, {from: account_three});
    var accountCounts = (await pcoinIns._accountCounts()).toNumber();
    assert.equal(accountCounts, 3);
    await pcoinIns.transfer(account_one, 90000000, {from: account_three});
    a3_balance_0 = (await pcoinIns.balanceOf(account_three)).toNumber();
    a1_balance_0 = (await pcoinIns.balanceOf(account_one)).toNumber();
    assert.equal(a3_balance_0, 0);
    assert.equal(a1_balance_0, 100000000);
    accountCounts = (await pcoinIns._accountCounts()).toNumber();
    assert.equal(accountCounts, 2);
    totalSupply_0 = (await pcoinIns.totalSupply()).toNumber();
    assert.equal(totalSupply_0, 200000000);
  });

  it('approve', async() => {
    await pcoinIns.approve(account_four, 1000, {from: account_one});
    var allowanceBalance = (await pcoinIns.allowance(account_one, account_four)).toNumber();
    assert.equal(allowanceBalance, 1000);
    await pcoinIns.increaseAllowance(account_four, 5000, {from: account_one});
    allowanceBalance = (await pcoinIns.allowance(account_one, account_four)).toNumber();
    assert.equal(allowanceBalance, 6000);
    await pcoinIns.decreaseAllowance(account_four, 1000, {from: account_one});
    allowanceBalance = (await pcoinIns.allowance(account_one, account_four)).toNumber();
    assert.equal(allowanceBalance, 5000);

    var a1_balance_0 = (await pcoinIns.balanceOf(account_one)).toNumber();
    var a3_balance_0 = (await pcoinIns.balanceOf(account_three)).toNumber();
    await pcoinIns.transferFrom(account_one, account_three, 1000, {from: account_four});
    var a1_balance_1 = (await pcoinIns.balanceOf(account_one)).toNumber();
    var a3_balance_1 = (await pcoinIns.balanceOf(account_three)).toNumber();
    assert.equal(a1_balance_0, a1_balance_1+1000);
    assert.equal(a3_balance_0, a3_balance_1-1000);

    var totalSupply_0 = (await pcoinIns.totalSupply()).toNumber();
    assert.equal(totalSupply_0, 200000000);

    // transferFrom amount exceeds test success
    // await pcoinIns.transferFrom(account_one, account_three, 4001, {from: account_four});
  });

  it('minter-manager', async() => {
    var byte32_MINTER_ROLE = await pcoinIns.MINTER_ROLE();
    pcoinIns.revokeRole(byte32_MINTER_ROLE, account_two, {from: account_one});
    // mint fail for account_two is not minter test success
    //await pcoinIns.mint(account_three, 100000000, {from: account_two});
    await pcoinIns.changeAdmin(account_two, {from: account_one});
    // minter manager change from one to two test success
    // await pcoinIns.grantRole(byte32_MINTER_ROLE, account_two, {from: account_one});
    await pcoinIns.grantRole(byte32_MINTER_ROLE, account_one, {from: account_two});
    await pcoinIns.mint(account_three, 100000000, {from: account_one});
    // mint over maxSupply test success
    //var maxSupply = (await pcoinIns.getMaxSupply()).toNumber();
    //var x = new BigNumber('10e+18');
    //var y = x.multipliedBy(maxSupply);
    //console.log(maxSupply, x.toNumber(), typeof y.toNumber());
    //await pcoinIns.mint(account_three, y, {from: account_one});
    var accountCounts = (await pcoinIns._accountCounts()).toNumber();
    console.log(accountCounts);
  });

  it('blacklister', async() => {
    //var a1_snapshot_0 = await pcoinIns.getSnapshot(account_one);
    //console.log(a1_snapshot_0.content);
    await pcoinIns.addBlacklist(account_four, {from: account_two});
    // test success for transfer pcoin to account_four who is in blacklist
    //await pcoinIns.transfer(account_four, 10000000, {from: account_three});
    // test success for account_four who is in blacklist transfer pcoin
    // await pcoinIns.transfer(account_three, 10000000, {from: account_four});
    // test success for mint pcoin to account_four who is in blacklist
    // await pcoinIns.mint(account_four, 100000000, {from: account_one});
  });

  it('permit', async() => {
    var revision = await pcoinIns.REVISION();
    console.log("version=" + revision);
  });

  it ('prxoy-upgrade', async() => {

       var totalSupply = new BigNumber(await pcoinIns.totalSupply());
       console.log(totalSupply.toNumber());

       var name = await pcoinIns.name();
       var symbol = await pcoinIns.symbol();

       var pcoinMock = await PolylendTokenMock.deployed();

       var _initParams = [
          account_one,
          pcoinMock.address,
          name,
          symbol,
          18
       ];

       await _upgrade.Upgrade(_initParams, {from: account_one});

       totalSupply = new BigNumber(await pcoinIns.totalSupply());
       console.log(totalSupply.toNumber());

       //pcoinProxy = await PolylendToken.at(await _upgrade._tokenProxy());
       //var symbol = await pcoinProxy.symbol();
       //console.log(symbol);

       //var pcoinMock = await PolylendTokenMock.deployed();

       //await _upgrade.Upgrade(pcoinMock.address, {from:accounts[0]});

  });

});
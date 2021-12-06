// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

import {InitializableAdminUpgradeabilityProxy} from "../dependencies/contracts/proxy/InitializableAdminUpgradeabilityProxy.sol";
import {Ownable} from "../dependencies/contracts/access/Ownable.sol";
import {PolylendToken} from "./PolylendToken.sol";

contract UpgradeToken is Ownable {

    address public _tokenProxy;

    struct TokenInput {
        address admin;
        address impl;
        string name;
        string symbol;
        uint8 decimals;
    }

    function Initialize(TokenInput calldata input)
        external
        onlyOwner
    {
        require(_tokenProxy == address(0), 'Create fail for proxy exist');
        InitializableAdminUpgradeabilityProxy proxy =
            new InitializableAdminUpgradeabilityProxy();

        bytes memory initParams = abi.encodeWithSelector(
            PolylendToken.initialize.selector,
            input.admin,
            input.name,
            input.symbol,
            input.decimals
        );

        proxy.initialize(input.impl, address(this), initParams);

        _tokenProxy = address(proxy);
    }

    function Upgrade(TokenInput calldata input)
        external
        onlyOwner
    {
        require(_tokenProxy != address(0), 'Upgrade fail for proxy null');
        InitializableAdminUpgradeabilityProxy proxy =
            InitializableAdminUpgradeabilityProxy(payable(_tokenProxy));

        bytes memory initParams = abi.encodeWithSelector(
            PolylendToken.initialize.selector,
            input.admin,
            input.name,
            input.symbol,
            input.decimals
        );

        proxy.upgradeToAndCall(input.impl, initParams);
    }
}
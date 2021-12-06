// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

import {PolylendToken} from "../token/PolylendToken.sol";

contract PolylendTokenMock is PolylendToken {

    function getRevision() internal pure override returns (uint256) {
        return 0x2;
    }
}
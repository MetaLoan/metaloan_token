// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

import {MetaLoanToken} from "../token/MetaLoanToken.sol";

contract MetaLoanTokenMock is MetaLoanToken {

    function getRevision() internal pure override returns (uint256) {
        return 0x2;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;
    constructor() ERC721("User NFT", "User"){}
    function mint(string memory _tokenURI) external returns(uint) {
         tokenCount ++;
         // mint the NFT token to the blockchain
         _safeMint(msg.sender, tokenCount);
         //set token ID to access the metadata based on the URI
         _setTokenURI(tokenCount, _tokenURI);
            
         return(tokenCount);
    }
}
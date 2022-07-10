// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "hardhat/console.sol";

contract User is ReentrancyGuard  {

    // Variables
    uint public itemCount; 

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        address payable minter;
        bool transfered;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    // event when a token is created
    event ListCreatedToken(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address indexed minter
    );
    

    // event used to record a account transfer 
    event Distribute(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address indexed minter,
        address indexed receiver
    );


    // Make an NFT account token
    function createAccount(IERC721 _nft, uint _tokenId) public {
        // increment itemCount
        console.log("this is called create account");
        itemCount++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            payable(msg.sender),
            false
        );
       
        // emit ListCreatedToken event
        emit ListCreatedToken(
            itemCount,
            address(_nft),
            _tokenId,
            msg.sender
        );

    }

    function distributeAccountToken(uint _itemId , address useraddress) public {
      
         console.log("this is distribute account");
     //   address _toUser =  address(useraddress);  
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(!item.transfered, "item has already been transfered");
  
        // update item to sold
        item.transfered = true;
        /*
        Transfers a specific NFT (tokenId) from one account (from) to another (to).
        Requirements: - If the caller is not from, it must be approved to move this NFT by either approve or setApprovalForAll.
        */ 
        item.nft.transferFrom(address(this),useraddress, item.tokenId);
        
        // emit Distribute event
        emit Distribute(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.minter,
            useraddress
        );
    
    }

}

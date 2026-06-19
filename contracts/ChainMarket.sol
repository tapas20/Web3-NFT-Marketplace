// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChainMarket is ReentrancyGuard, Ownable {
    uint256 private _listingIds;
    uint256 private _itemsSold;

    address payable public platformOwner;
    uint256 public listingFee = 0.01 ether;

    struct Listing {
        uint256 id;
        string productId; // MongoDB Product ID
        address payable seller;
        address payable owner;
        uint256 price;
        bool isSold;
    }

    mapping(uint256 => Listing) private idToListing;

    event ListingCreated(
        uint256 indexed listingId,
        string productId,
        address seller,
        address owner,
        uint256 price,
        bool isSold
    );

    event ItemSold(
        uint256 indexed listingId,
        string productId,
        address seller,
        address owner,
        uint256 price
    );

    constructor() Ownable(msg.sender) {
        platformOwner = payable(msg.sender);
    }

    /* Updates the listing fee of the contract */
    function updateListingFee(uint256 _listingFee) public onlyOwner {
        listingFee = _listingFee;
    }

    /* Returns the listing fee of the contract */
    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    /* Places an item for sale on the marketplace */
    function createListing(
        string memory productId,
        uint256 price
    ) public payable nonReentrant returns (uint256) {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingFee, "Price must be equal to listing fee");

        _listingIds++;
        uint256 currentId = _listingIds;

        idToListing[currentId] = Listing(
            currentId,
            productId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        emit ListingCreated(
            currentId,
            productId,
            msg.sender,
            address(this),
            price,
            false
        );

        return currentId;
    }

    /* Executes the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function purchaseItem(
        uint256 listingId
    ) public payable nonReentrant {
        uint256 price = idToListing[listingId].price;
        address seller = idToListing[listingId].seller;
        
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        require(!idToListing[listingId].isSold, "Item already sold");
        require(msg.sender != seller, "Seller cannot buy their own item");

        idToListing[listingId].owner = payable(msg.sender);
        idToListing[listingId].isSold = true;
        
        _itemsSold++;

        // Transfer listing fee to platform owner
        platformOwner.transfer(listingFee);
        
        // Transfer sale value to the seller
        payable(seller).transfer(msg.value);

        emit ItemSold(
            listingId,
            idToListing[listingId].productId,
            seller,
            msg.sender,
            price
        );
    }

    /* Returns all unsold market items */
    function fetchActiveListings() public view returns (Listing[] memory) {
        uint256 totalItemCount = _listingIds;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (!idToListing[i + 1].isSold) {
                itemCount += 1;
            }
        }

        Listing[] memory items = new Listing[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (!idToListing[i + 1].isSold) {
                uint256 currentId = i + 1;
                Listing storage currentItem = idToListing[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        
        return items;
    }

    /* Returns a specific listing by ID */
    function fetchListing(uint256 listingId) public view returns (Listing memory) {
        return idToListing[listingId];
    }
}

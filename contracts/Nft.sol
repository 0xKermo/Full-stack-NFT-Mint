// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @creator:     behzatç
/// @author:      behzatç

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract mintPass is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    bytes32 public root; // // who can mint on presale ? 

    string BASE_URI = "your uri"; // What will my mintPass look like?
    
    bool public IS_PRESALE_ACTIVE = false; // is Presale started?
    bool public IS_SALE_ACTIVE = false;  // is Publicsale started?
    
    uint public constant TOTAL_SUPPLY = 9999; // MAX_SUPPLY - My mintPass = number of siblings of my mintPass
    uint public constant MINT_PRICE = 0.01 ether; // how much will i pay? 

    uint constant NUMBER_OF_TOKENS_ALLOWED_PER_ADDRESS = 2; // how many can i get?
    
    mapping (address => uint) addressToMintCount; // How many nft did I mint?

     /*
    @Person: Will bots be able to mint?

    @return: No. 
    */
    modifier onlyAccounts () {
        require(msg.sender == tx.origin, "Not allowed origin");
        _;
    }
    
    constructor(string memory name, string memory symbol, bytes32 merkleroot)
    ERC721(name, symbol)
    {
        root = merkleroot;
        _tokenIdCounter.increment();
    }
    
    function setMerkleRoot(bytes32 merkleroot) 
    onlyOwner 
    public 
    {
        root = merkleroot;
    }
    
    // get metadata
    function _baseURI() internal view override returns (string memory) {
        return BASE_URI;
    }
    // set metadata
    function setBaseURI(string memory newUri) 
    public 
    onlyOwner {
        BASE_URI = newUri;
    }

    // Publicsale activate or deactivate
    function togglePublicSale() public 
    onlyOwner 
    {
        IS_SALE_ACTIVE = !IS_SALE_ACTIVE;
    }
    
    // Presale activate or deactivate
    function togglePreSale() public 
    onlyOwner 
    {
        IS_PRESALE_ACTIVE = !IS_PRESALE_ACTIVE;
    }
    
    // contract ownermint
    function ownerMint(uint numberOfTokens) 
    public 
    onlyOwner {
        uint current = _tokenIdCounter.current();
        require(current + numberOfTokens < TOTAL_SUPPLY, "Exceeds total supply");

        for (uint i = 0; i < numberOfTokens; i++) {
            mintNFT();
        }
    }

    function presaleMint(address account, uint numberOfTokens, uint256 allowance, bytes32[] calldata proof)
    public
    payable
    onlyAccounts
    {
        require(msg.sender == account, "Not allowed");
        require(IS_PRESALE_ACTIVE, "Pre-sale haven't started");
        require(msg.value >= numberOfTokens * MINT_PRICE, "Not enough ethers sent");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(proof, root, leaf), "Invalid merkle proof");
        
        uint current = _tokenIdCounter.current();
        
        require(current + numberOfTokens <= TOTAL_SUPPLY, "Exceeds total supply");
        require(addressToMintCount[msg.sender] + numberOfTokens <= allowance, "Exceeds allowance");

        addressToMintCount[msg.sender] += numberOfTokens;

        for (uint i = 0; i < numberOfTokens; i++) {
            mintNFT();
        }
    }

    function publicSaleMint(uint numberOfTokens) 
    public 
    payable
    onlyAccounts
    {
        require(IS_SALE_ACTIVE, "Sale haven't started");
        require(msg.value >= numberOfTokens * MINT_PRICE, "Not enough ethers sent");
        
        uint current = _tokenIdCounter.current();
        
        require(current + numberOfTokens < TOTAL_SUPPLY, "Exceeds total supply");
        require(addressToMintCount[msg.sender] + numberOfTokens <= NUMBER_OF_TOKENS_ALLOWED_PER_ADDRESS, "Exceeds allowance");
        
        addressToMintCount[msg.sender] += numberOfTokens;

        for (uint i = 0; i < numberOfTokens; i++) {
            mintNFT();
        }
    }

    function getCurrentMintCount(address _account) public view returns (uint) {
        return addressToMintCount[_account];
    }

    function mintNFT() internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId);
    }

    function withdrawAll() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0);
        
        _withdraw(owner(), address(this).balance);
    }

    function _withdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    function totalSupply() public view returns (uint) {
        return _tokenIdCounter.current() - 1;
    }

    function tokensOfOwner(address _owner, uint startId, uint endId) external view returns(uint256[] memory ) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 index = 0;

            for (uint256 tokenId = startId; tokenId < endId; tokenId++) {
                if (index == tokenCount) break;

                if (ownerOf(tokenId) == _owner) {
                    result[index] = tokenId;
                    index++;
                }
            }

            return result;
        }
    }


    function _leaf(address account, string memory payload)
    internal pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(payload, account));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof)
    internal view returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MyHybridNFT is ERC721A, Ownable {
    // 1. 状态变量
    bytes32 public merkleRoot;              // 白名单树根
    uint256 public constant MINT_PRICE = 0.01 ether; 
    uint256 public constant MAX_SUPPLY = 1000;
    string private _baseTokenURI;           // 存放 IPFS 地址

    // 2. 构造函数
    constructor(string memory baseURI) ERC721A("HybridNFT", "HNFT") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    // 3. 白名单铸造 (利用 Merkle Proof 验证)
    function whitelistMint(uint256 quantity, bytes32[] calldata proof) external payable {
        // A. 校验总量
        require(totalSupply() + quantity <= MAX_SUPPLY, "Max supply exceeded");
        // B. 校验是否在白名单 (核心逻辑)
        // Leaf = Hash(用户地址)
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid Merkle Proof");
        // C. 校验金额 (假设白名单半价)
        require(msg.value >= (MINT_PRICE / 2) * quantity, "Insufficient funds");

        // D. 铸造 (ERC721A 的优势：_mint 极其省钱)
        _mint(msg.sender, quantity);
    }

    // 4. 公开铸造
    function publicMint(uint256 quantity) external payable {
        require(totalSupply() + quantity <= MAX_SUPPLY, "Max supply exceeded");
        require(msg.value >= MINT_PRICE * quantity, "Insufficient funds");

        _mint(msg.sender, quantity);
    }

    // 5. 管理员功能
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // 6. 覆写 baseURI 以支持 IPFS
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
}
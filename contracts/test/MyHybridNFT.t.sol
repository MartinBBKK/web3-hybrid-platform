// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyHybridNFT.sol";

contract MyHybridNFTTest is Test {
    MyHybridNFT public nft;
    
    // 定义测试用户 (Foundry 的标准测试地址)
    address alice = address(0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496);
    address bob = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
    
    // 预算的 Root (包含 Alice 和 Bob)
    // 动态计算由于测试
    bytes32 root;
    bytes32 leafAlice;
    bytes32 leafBob;

    function setUp() public {
        // 1. 计算两个叶子节点
        leafAlice = keccak256(abi.encodePacked(alice));
        leafBob = keccak256(abi.encodePacked(bob));

        // 2. 计算 Root (简单的 2 叶子树：Root = Hash(Sort(Leaf1, Leaf2)))
        // OpenZeppelin MerkleProof 验证时会自动排序，所以生成 Root 时也要排序
        if (leafAlice < leafBob) {
            root = keccak256(abi.encodePacked(leafAlice, leafBob));
        } else {
            root = keccak256(abi.encodePacked(leafBob, leafAlice));
        }

        // 部署合约
        nft = new MyHybridNFT("ipfs://QmYourHash/");
        // 设置正确的白名单 Root
        nft.setMerkleRoot(root);
    }

    // ... (testPublicMint 保持不变) ...

    function testPublicMint() public {
        vm.deal(alice, 10 ether);
        vm.prank(alice);

        nft.publicMint{value: 0.01 ether}(1);

        assertEq(nft.balanceOf(alice), 1);
        assertEq(nft.totalSupply(), 1);
    }

    // 测试 2: 白名单铸造 (Whitelist Mint)
    function testWhitelistMint() public {
        vm.deal(alice, 10 ether);
        vm.prank(alice);

        // 3. 构造 Proof
        // 对于 2 个叶子的树，Alice 的 Proof 就是 Bob 的叶子 (兄弟节点)
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = leafBob;

        // 白名单价格是 0.005
        nft.whitelistMint{value: 0.005 ether}(1, proof);

        assertEq(nft.balanceOf(alice), 1);
    }

    // 测试 3: 失败测试 (验证非法 Proof)
    function testFailInvalidProof() public {
        // 随便搞个假用户
        address fakeUser = address(0x123);
        vm.deal(fakeUser, 10 ether);
        vm.prank(fakeUser);

        bytes32[] memory proof = new bytes32[](1);
        proof[0] = 0x0000000000000000000000000000000000000000000000000000000000000000;

        // 应该报错并 Revert
        nft.whitelistMint{value: 0.005 ether}(1, proof);
    }
}
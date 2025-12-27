// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyHybridNFT.sol";

contract DeployScript is Script {
    function run() external {
        // 1. 获取环境变量
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // 2. 开始广播交易 (之后的操作都会上链)
        vm.startBroadcast(deployerPrivateKey);

        // 3. 部署合约
        // TODO: 把下面这个 bytes32 替换成你刚才运行脚本生成的 Root Hash！！！
        bytes32 root = 0xd7e170e1a7d890abd1c7aa6f1f0352c6af7625fb7300ade71d52f1e161a5ebd4;
        
        // IPFS 占位符，之后可以用 setBaseURI 修改
        string memory baseURI = "ipfs://QmPlaceholder/";

        // 3. 部署合约 (构造函数只接受 baseURI)
        MyHybridNFT nft = new MyHybridNFT(baseURI);
        
        // 4. 设置 Merkle Root
        nft.setMerkleRoot(root);

        console.log("----------------------------------------------------");
        console.log("Deployed Contract Address:", address(nft));
        console.log("----------------------------------------------------");

        vm.stopBroadcast();
    }
}
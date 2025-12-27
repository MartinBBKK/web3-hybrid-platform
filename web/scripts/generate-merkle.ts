import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 模拟白名单用户 (在真实项目中，这里会从 Supabase 数据库读取)
const whitelistAddresses = [
    "0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496", // 测试账号 A
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // 测试账号 B
    // 👇 把你自己的 MetaMask 钱包地址填在这里，否则你等会儿无法测试 Mint！
    "0x6Cd13a35b950df6e3D558CA997908e51365e80C9"
];

// 2. 将地址哈希化 (Leaf Nodes)
// 注意：Solidity 的 keccak256 和 JS 的 keccak256 处理方式略有不同
// 这里我们直接对地址 buffer 进行哈希，这是标准做法
const leafNodes = whitelistAddresses.map(addr => keccak256(addr));

// 3. 生成树
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

// 4. 获取树根 (Root) - 这就是我们要存入合约的数据
// toString('hex') 会得到不带 0x 的字符串，我们需要手动加 '0x'
const root = '0x' + merkleTree.getRoot().toString('hex');

console.log("----------------------------------------------------");
console.log("🌳 Merkle Tree Generated!");
console.log("----------------------------------------------------");
console.log("Root Hash:", root);
console.log("----------------------------------------------------");

// 5. 导出 Proof 数据供前端使用
const data = whitelistAddresses.reduce((acc, addr) => {
    const leaf = keccak256(addr);
    const proof = merkleTree.getHexProof(leaf);
    acc[addr] = proof;
    return acc;
}, {} as any);

// 写入文件
const outputPath = path.join(__dirname, '../utils/whitelist.json');
// 确保目录存在
if (!fs.existsSync(path.join(__dirname, '../utils'))) {
    fs.mkdirSync(path.join(__dirname, '../utils'));
}

fs.writeFileSync(outputPath, JSON.stringify({ root, proofs: data }, null, 2));
console.log(`📄 Whitelist data saved to: web/utils/whitelist.json`);
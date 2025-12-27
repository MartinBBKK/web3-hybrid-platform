"use client";

import { ConnectKitButton } from "connectkit";
import { useReadContract, useAccount } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

export default function Home() {
  const { isConnected } = useAccount();

  // 读取最大供应量
  const { data: maxSupply } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "MAX_SUPPLY",
  });

  // 读取总供应量 (已铸造数量)
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "totalSupply",
    query: {
      refetchInterval: 3000 // 每3秒刷新一次
    }
  });

  // 读取价格
  const { data: price } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "MINT_PRICE",
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Hybrid NFT Platform
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
          {/* 👇 ConnectKit 提供的超强按钮 */}
          <ConnectKitButton />
        </div>
      </div>

      <div className="relative flex place-items-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            CyberPunk Collection
          </h1>
          <p className="text-xl mb-8">
            Web3 Security + Web2 Speed
          </p>

          {/* 数据展示面板 */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <div className="text-center">
              <div className="text-gray-400 text-sm">已铸造</div>
              <div className="text-2xl font-bold">
                {totalSupply?.toString() ?? "0"} / {maxSupply?.toString() ?? "1000"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-sm">价格</div>
              <div className="text-2xl font-bold">
                {price ? formatEther(price) : "0.01"} ETH
              </div>
            </div>
          </div>

          {!isConnected && (
            <div className="mt-8 text-yellow-500 animate-pulse">
              请先连接钱包以查看更多信息 👆
            </div>
          )}
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {/* Footer Area */}
      </div>
    </main>
  );
}
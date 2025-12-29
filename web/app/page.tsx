"use client";

import { ConnectKitButton } from "connectkit";
import { useReadContract, useAccount } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { MintSection } from "../components/MintSection"; // 👈 引入
import { Gallery } from "../components/Gallery"; // 👈 引入

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
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/20 border-b border-white/5">

        {/* 左侧 Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-purple-600 to-pink-600 rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-black text-xl italic font-mono">H</span>
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              HYBRID
            </span>
            <span className="text-[10px] font-mono leading-none text-purple-400 tracking-[0.3em] mt-1">
              PLATFORM
            </span>
          </div>
        </div>

        {/* 右侧钱包按钮 */}
        <div className="flex items-center gap-4">
          <ConnectKitButton />
        </div>
      </nav>

      {/* 主内容区域，增加顶部 padding 防止被导航栏遮挡 */}
      <div className="relative flex flex-col items-center pt-20 w-full">
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
        {/* 👇 把 Mint 组件放在这里 */}
        <div className="mt-12 w-full">
          <MintSection />
        </div>
        <Gallery />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {/* Footer Area */}
      </div>
    </main>
  );
}
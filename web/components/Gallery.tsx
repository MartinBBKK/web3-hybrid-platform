"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { NFTCard } from "./NFTCard";

export const Gallery = () => {
    // 读取当前总供应量
    const { data: totalSupply, isLoading, error } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "totalSupply",
        query: { refetchInterval: 5000 }
    });
    console.log("Gallery Debug Info:", { totalSupply, isLoading, error, CONTRACT_ADDRESS });
    if (!totalSupply) return null;

    const total = Number(totalSupply);
    // 只展示最后 6 个，或者全部（如果小于6个）
    const startIndex = Math.max(0, total - 6);
    const tokenIds = [];

    // 倒序展示：最新的在前面
    for (let i = total - 1; i >= startIndex; i--) {
        tokenIds.push(i);
    }

    return (
        <div className="mt-20 w-full max-w-6xl">
            <h3 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                🏛️ 实时画廊 (Latest Mints)
            </h3>

            {total === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    暂无 NFT，快去铸造第一个吧！
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {tokenIds.map((id) => (
                        <NFTCard key={id} tokenId={id} />
                    ))}
                </div>
            )}
        </div>
    );
};
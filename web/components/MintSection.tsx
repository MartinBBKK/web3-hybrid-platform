"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import whitelistData from "../utils/whitelist.json"; // 👈 导入生成的白名单数据

export const MintSection = () => {
    const { address, isConnected } = useAccount();
    const [mintQuantity, setMintQuantity] = useState(1);

    // Wagmi 写合约 Hooks
    const { data: hash, writeContract, isPending: isWritePending, error: writeError } = useWriteContract();

    // 监听交易回执 (Loading 状态)
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // 1. 判断用户资格
    // whitelistData.proofs 是一个对象: { "0x地址": ["proof..."], ... }
    // 我们需要把当前连接的地址转成小写来匹配（为了保险）
    // 注意：whitelist.json 里的 key 如果是 checksum 地址，这里可能需要调整。
    // 最稳妥的方式是把 json 里的 key 和这里的 address 都 normalize 一下。
    const userProof = address ? (whitelistData.proofs as any)[address] : null;
    const isWhitelisted = !!userProof;

    // 2. 核心铸造逻辑
    const handleMint = async () => {
        if (!address) return;

        try {
            if (isWhitelisted) {
                console.log("💎 User is whitelisted! Proof:", userProof);
                // 调用白名单铸造 (0.005 ETH)
                writeContract({
                    address: CONTRACT_ADDRESS as `0x${string}`,
                    abi: CONTRACT_ABI,
                    functionName: "whitelistMint",
                    args: [BigInt(mintQuantity), userProof], // 传 Proof
                    value: parseEther("0.005") * BigInt(mintQuantity), // 半价
                });
            } else {
                console.log("👤 User is Public. Normal mint.");
                // 调用公开铸造 (0.01 ETH)
                writeContract({
                    address: CONTRACT_ADDRESS as `0x${string}`,
                    abi: CONTRACT_ABI,
                    functionName: "publicMint",
                    args: [BigInt(mintQuantity)],
                    value: parseEther("0.01") * BigInt(mintQuantity), // 原价
                });
            }
        } catch (err) {
            console.error("Mint failed", err);
        }
    };

    if (!isConnected) return null;

    return (
        <div className="mt-10 p-6 bg-gray-800 rounded-2xl border border-gray-700 max-w-md mx-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-center">
                {isWhitelisted ? "🎉 您在白名单中！" : "🌊 公开铸造开启"}
            </h3>

            {/* 数量选择 */}
            <div className="flex justify-center items-center gap-4 mb-6">
                <button
                    className="btn btn-sm btn-circle bg-gray-700 text-white border-none"
                    onClick={() => setMintQuantity(Math.max(1, mintQuantity - 1))}
                >-</button>
                <span className="text-xl font-mono">{mintQuantity}</span>
                <button
                    className="btn btn-sm btn-circle bg-gray-700 text-white border-none"
                    onClick={() => setMintQuantity(Math.min(5, mintQuantity + 1))}
                >+</button>
            </div>

            {/* 价格提示 */}
            <div className="text-center mb-6 text-gray-400">
                总价: <span className="text-white font-bold">
                    {isWhitelisted ? 0.005 * mintQuantity : 0.01 * mintQuantity} ETH
                </span>
            </div>

            {/* Mint 按钮 */}
            <button
                onClick={handleMint}
                disabled={isWritePending || isConfirming}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95
          ${isWhitelisted
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.5)]"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"}
          disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        `}
            >
                {isWritePending ? "请在钱包确认..." :
                    isConfirming ? "交易打包中..." :
                        isWhitelisted ? "🔥 白名单 Mint (5折)" : "🚀 立即 Mint"}
            </button>

            {/* 错误信息 */}
            {writeError && (
                <div className="mt-4 p-3 bg-red-900/50 text-red-200 text-sm rounded-lg text-center">
                    {writeError.message.includes("User denied") ? "用户取消了交易" : "交易出错，请检查控制台"}
                </div>
            )}

            {/* 成功信息 */}
            {isConfirmed && (
                <div className="mt-4 p-3 bg-green-900/50 text-green-200 text-sm rounded-lg text-center animate-bounce">
                    ✨ 铸造成功！快去 OpenSea 查看吧！
                </div>
            )}
        </div>
    );
};
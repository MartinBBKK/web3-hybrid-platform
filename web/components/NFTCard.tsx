"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { ipfsToHttp } from "../utils/ipfs";

export const NFTCard = ({ tokenId }: { tokenId: number }) => {
    const [metadata, setMetadata] = useState<any>(null);
    const [imageUri, setImageUri] = useState("/placeholder.png"); // 默认图

    // 1. 从合约读取 TokenURI
    const { data: tokenURI } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
    });

    // 2. 解析元数据 (当 tokenURI 获取到后)
    useEffect(() => {
        if (tokenURI) {
            const httpUri = ipfsToHttp(tokenURI as string);

            fetch(httpUri)
                .then((res) => res.json())
                .then((data) => {
                    setMetadata(data);
                    if (data.image) {
                        setImageUri(ipfsToHttp(data.image));
                    }
                })
                .catch((err) => {
                    console.error("Metadata fetch failed:", err);
                    // 如果获取失败（因为我们部署时用了假的 BaseURI），展示 ID
                });
        }
    }, [tokenURI]);

    return (
        <div className="card bg-gray-800 shadow-xl border border-gray-700 hover:scale-105 transition-transform duration-300">
            <figure className="relative pt-[100%] w-full bg-gray-900 overflow-hidden">
                {/* 图片展示区 */}
                <img
                    src={imageUri}
                    alt={`Token ${tokenId}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={(e) => {
                        // 图片加载失败时的回退
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                />
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title text-white text-lg">
                    {metadata?.name || `Hybrid NFT #${tokenId}`}
                </h2>
                <p className="text-gray-400 text-sm truncate">
                    {metadata?.description || "Loading metadata..."}
                </p>
                <div className="card-actions justify-end mt-2">
                    <div className="badge badge-outline text-xs text-gray-500">ERC721A</div>
                </div>
            </div>
        </div>
    );
};
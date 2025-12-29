"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

// 1. 创建 Wagmi 配置
const config = createConfig(
    getDefaultConfig({
        // 你的 DApp 信息
        appName: "My Hybrid NFT",

        // 这里的 ID 需要去 cloud.walletconnect.com 申请
        // 暂时可以用这个公共测试 ID，但生产环境请务必换成自己的
        walletConnectProjectId: "c0e6b52701f46613340b01c1340b01c1",

        chains: [sepolia],
        transports: {
            [sepolia.id]: http("https://ethereum-sepolia.publicnode.com"),
            // [sepolia.id]: http(), // 使用默认 RPC
        },
        ssr: true, // 开启服务端渲染支持
    })
);

// 2. 创建 React Query Client
const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider mode="auto">
                    {children}
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
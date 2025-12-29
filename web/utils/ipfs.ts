export const ipfsToHttp = (uri: string) => {
    if (!uri) return "";

    // 如果已经是 http 开头，直接返回
    if (uri.startsWith("http")) return uri;

    // 将 ipfs:// 替换为网关地址
    // 商业项目中通常使用 Pinata 私有网关，这里用公共网关演示
    const gateway = "https://ipfs.io/ipfs/";
    return uri.replace("ipfs://", gateway);
};
import { ethers } from "ethers";
import ChainMarketABI from "./contracts/ChainMarket.json";

export const CHAIN_MARKET_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export const getContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(
    CHAIN_MARKET_ADDRESS,
    ChainMarketABI.abi,
    providerOrSigner
  );
};

export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  
  // Fallback to read-only provider if no wallet
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-amoy.polygon.technology/";
  return new ethers.JsonRpcProvider(rpcUrl);
};

import { useState, useCallback } from "react";
import { ethers } from "ethers";

export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectAndSign = useCallback(async (messageToSign: string = "Sign in to ChainMarket") => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it to connect.");
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask.");
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Request signature for authentication
      const signature = await signer.signMessage(messageToSign);

      return {
        address,
        signature,
        message: messageToSign,
      };
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      setError(err.message || "Failed to connect wallet");
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return {
    connectAndSign,
    isConnecting,
    error,
  };
}

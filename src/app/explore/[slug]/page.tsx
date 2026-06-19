"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ethers } from "ethers";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Loader2,
  Wallet,
  AlertCircle
} from "lucide-react";
import NextLink from "next/link";
import { motion } from "framer-motion";

import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { getContract } from "@/lib/contract";
import { Button } from "@/components/ui/button";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.slug as string;

  const { data, isLoading, error } = useProduct(slug);
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const [activeImage, setActiveImage] = useState(0);
  const [purchaseStep, setPurchaseStep] = useState<"idle" | "tx" | "success">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const product = data?.product;

  const handlePurchase = async () => {
    if (!product) return;
    setPurchaseError(null);
    setPurchaseStep("tx");

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is required to make a purchase.");
      }

      // Check network
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(80002)) {
         try {
           await window.ethereum.request({
             method: 'wallet_switchEthereumChain',
             params: [{ chainId: '0x13882' }],
           });
         } catch (e) {
           throw new Error("Please switch to the Polygon Amoy testnet.");
         }
      }

      const signer = await provider.getSigner();
      const contract = getContract(signer);

      // We need the listing ID from the smart contract.
      // Since our contract maps listing IDs sequentially, we should fetch active listings
      // and find the one that matches our MongoDB productId.
      const activeListings = await contract.fetchActiveListings();
      const listing = activeListings.find((l: any) => l.productId === product.id);

      if (!listing) {
        throw new Error("This item is not currently listed on the blockchain. It may have already been sold.");
      }

      const listingId = listing.id;
      const priceInWei = ethers.parseEther(product.price.toString());

      // Send purchase transaction
      const tx = await contract.purchaseItem(listingId, {
        value: priceInWei,
      });

      setTxHash(tx.hash);
      
      // Wait for confirmation
      await tx.wait();

      // Update Database Status
      await updateProduct({
        id: product.id,
        data: { status: "SOLD" }
      });

      setPurchaseStep("success");

    } catch (err: any) {
      console.error("Purchase error:", err);
      setPurchaseError(err.reason || err.message || "Failed to complete purchase");
      setPurchaseStep("idle");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Button variant="outline" onClick={() => router.push("/explore")}>
          Back to Explore
        </Button>
      </div>
    );
  }

  const isOwner = session?.user?.id === product.sellerId;
  const isSold = product.status === "SOLD";

  if (purchaseStep === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center py-24 px-4">
        <div className="glass max-w-md w-full p-10 rounded-3xl text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold">Purchase Successful!</h2>
          <p className="text-muted-foreground">
            You are now the proud owner of this asset. The transaction has been permanently recorded on the Polygon blockchain.
          </p>
          <div className="pt-4 space-y-3">
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              View My Assets
            </Button>
            <Button variant="outline" onClick={() => router.push("/explore")} className="w-full">
              Continue Browsing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 pb-16">
      <div className="container-custom">
        <NextLink 
          href="/explore" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </NextLink>

        {purchaseError && (
          <div className="p-4 mb-8 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">{purchaseError}</div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Images */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass border border-border"
            >
              <Image
                src={product.images[activeImage] || "/placeholder.jpg"}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {isSold && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="px-6 py-3 rounded-full bg-red-500 text-white font-bold tracking-widest text-xl rotate-12 shadow-xl">
                    SOLD
                  </span>
                </div>
              )}
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === idx ? "border-primary shadow-glow" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {product.title}
              </h1>
              <div className="flex items-center text-3xl font-bold text-primary">
                {product.price.toLocaleString()} MATIC
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg">
                <MapPin className="h-4 w-4 mr-2" />
                {product.location}
              </div>
              <div className="flex items-center text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg">
                <Calendar className="h-4 w-4 mr-2" />
                Listed on {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert mb-10 max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="mt-auto pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Listed by</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {product.seller.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{product.seller.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {product.seller.walletAddress 
                          ? `${product.seller.walletAddress.slice(0, 6)}...${product.seller.walletAddress.slice(-4)}`
                          : "Web2 User"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Action */}
              {!session ? (
                <Button className="w-full h-14 text-lg" onClick={() => router.push(`/login?callbackUrl=/explore/${product.slug}`)}>
                  Log in to Purchase
                </Button>
              ) : isOwner ? (
                <Button variant="secondary" className="w-full h-14 text-lg" disabled>
                  You own this listing
                </Button>
              ) : isSold ? (
                <Button variant="outline" className="w-full h-14 text-lg border-red-500/50 text-red-500" disabled>
                  Item is Sold
                </Button>
              ) : (
                <div className="space-y-4">
                  {purchaseStep === "tx" ? (
                    <div className="glass rounded-xl p-4 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                      <p className="font-medium">Confirming Transaction...</p>
                      {txHash && (
                        <a 
                          href={`https://amoy.polygonscan.com/tx/${txHash}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline font-mono block mt-2"
                        >
                          View on Polygonscan
                        </a>
                      )}
                    </div>
                  ) : (
                    <Button 
                      className="w-full h-14 text-lg font-bold shadow-glow"
                      onClick={handlePurchase}
                    >
                      <Wallet className="mr-2 h-5 w-5" />
                      Purchase with MetaMask
                    </Button>
                  )}
                  <p className="text-center text-xs text-muted-foreground">
                    This action will execute a smart contract transaction on Polygon.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

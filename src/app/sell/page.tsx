"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ethers } from "ethers";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { productSchema } from "@/lib/validations";
import { useCreateProduct } from "@/hooks/useProducts";
import { getContract, getProvider } from "@/lib/contract";
import { ImageUpload } from "@/components/ui/image-upload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type ProductFormValues = z.infer<typeof productSchema>;

export default function SellPage() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "tx" | "success">("form");
  const [txHash, setTxHash] = useState<string | null>(null);

  const { mutateAsync: createDbProduct, isPending: isSaving } = useCreateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      images: [],
    },
  });

  const images = watch("images");

  const onSubmit = async (data: ProductFormValues) => {
    setGlobalError(null);
    setStep("tx");

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is required to create a listing.");
      }

      // 1. Connect to MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Check network (Amoy Testnet is chainId 80002)
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(80002)) {
         try {
           await window.ethereum.request({
             method: 'wallet_switchEthereumChain',
             params: [{ chainId: '0x13882' }], // 80002 in hex
           });
         } catch (e) {
           throw new Error("Please switch to the Polygon Amoy testnet in MetaMask.");
         }
      }

      // 2. Save to Database first to get the Product ID
      const dbResult = await createDbProduct(data);
      const productId = dbResult.product.id;

      // 3. Create Smart Contract Listing
      const contract = getContract(signer);
      
      // Get the required listing fee
      const listingFee = await contract.getListingFee();
      
      // Format price to wei (assuming user enters price in whole tokens, we use ethers.parseEther)
      // If the marketplace works in MATIC/ETH, parseEther is correct.
      const priceInWei = ethers.parseEther(data.price.toString());

      // Send transaction
      const tx = await contract.createListing(productId, priceInWei, {
        value: listingFee,
      });

      setTxHash(tx.hash);
      
      // Wait for confirmation
      await tx.wait();

      setSuccessMessage("Listing created successfully!");
      setStep("success");
      
    } catch (err: any) {
      console.error("Listing creation error:", err);
      // Clean up the error message from ethers
      const errorMsg = err.reason || err.message || "Failed to create listing";
      setGlobalError(errorMsg);
      setStep("form");
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center py-24 px-4">
        <div className="glass max-w-md w-full p-10 rounded-3xl text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold">Listing Live!</h2>
          <p className="text-muted-foreground">
            Your asset has been successfully listed on ChainMarket and the blockchain.
          </p>
          <div className="pt-4 space-y-3">
            <Button onClick={() => router.push("/explore")} className="w-full">
              View Marketplace
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "tx") {
    return (
      <div className="min-h-screen flex items-center justify-center py-24 px-4">
        <div className="glass max-w-md w-full p-10 rounded-3xl text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Loader2 className="h-20 w-20 text-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">Processing Transaction</h2>
          <p className="text-muted-foreground">
            Please confirm the transaction in MetaMask and wait for blockchain confirmation.
          </p>
          {txHash && (
            <div className="p-3 bg-secondary/50 rounded-lg text-sm break-all">
              <span className="text-muted-foreground block mb-1">Transaction Hash:</span>
              <a 
                href={`https://amoy.polygonscan.com/tx/${txHash}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline font-mono"
              >
                {txHash}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 pb-16">
      <div className="container-custom max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Create Listing</h1>
          <p className="text-muted-foreground text-lg">
            List your luxury asset on the blockchain. A small listing fee of 0.01 MATIC is required.
          </p>
        </div>

        {globalError && (
          <div className="p-4 mb-8 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">{globalError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 glass p-8 sm:p-10 rounded-3xl">
          {/* Images Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Product Images</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Upload up to 5 high-quality images of your asset.
            </p>
            <ImageUpload
              maxFiles={5}
              onUpload={(urls) => {
                setValue("images", urls, { shouldValidate: true });
              }}
            />
            {errors.images && (
              <p className="text-sm text-destructive">{errors.images.message}</p>
            )}
            <input type="hidden" {...register("images")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-semibold">Title</Label>
              <Input
                id="title"
                placeholder="e.g. 2024 Porsche 911 GT3"
                className="h-12 bg-secondary/50"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="category" className="text-base font-semibold">Category</Label>
              <Select 
                onValueChange={(val) => setValue("category", val as any, { shouldValidate: true })}
              >
                <SelectTrigger className="h-12 bg-secondary/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                  <SelectItem value="WATCH">Watch</SelectItem>
                  <SelectItem value="PROPERTY">Property</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="price" className="text-base font-semibold">Price (in MATIC)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="e.g. 5000"
                className="h-12 bg-secondary/50"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-base font-semibold">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Dubai, UAE"
                className="h-12 bg-secondary/50"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-semibold">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about your asset..."
              className="min-h-[150px] bg-secondary/50 resize-y"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold"
              disabled={isSaving || images.length === 0}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              {isSaving ? "Preparing Listing..." : "Create Web3 Listing"}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Requires 0.01 MATIC listing fee + Gas.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

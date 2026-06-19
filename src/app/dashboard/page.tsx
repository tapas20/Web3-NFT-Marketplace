"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Heart, PlusCircle, Loader2 } from "lucide-react";
import NextLink from "next/link";

import { useProducts } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if unauthenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    sellerId: session?.user?.id,
  });

  const { data: wishlistData, isLoading: isLoadingWishlist } = useWishlist();

  const myListings = productsData?.products || [];
  const myWishlist = wishlistData?.wishlist?.map((item: any) => item.product) || [];

  if (status === "loading" || isLoadingProducts || isLoadingWishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 pb-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your Web3 listings and view your saved assets.
            </p>
          </div>
          <NextLink href="/sell">
            <Button className="h-11 shadow-glow">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Listing
            </Button>
          </NextLink>
        </div>

        <div className="space-y-16">
          {/* Active Listings Section */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">My Listings</h2>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-secondary text-sm font-medium">
                {myListings.length}
              </span>
            </div>

            {myListings.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center border-dashed border-2 border-border/50">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-semibold mb-2">No active listings</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't listed any assets on the marketplace yet.
                </p>
                <NextLink href="/sell">
                  <Button variant="outline">Create your first listing</Button>
                </NextLink>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myListings.map((product: any, index: number) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </section>

          {/* Wishlist Section */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <Heart className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold">My Wishlist</h2>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-secondary text-sm font-medium">
                {myWishlist.length}
              </span>
            </div>

            {myWishlist.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center border-dashed border-2 border-border/50">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Explore the marketplace and save items you're interested in.
                </p>
                <NextLink href="/explore">
                  <Button variant="outline">Explore Marketplace</Button>
                </NextLink>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myWishlist.map((product: any, index: number) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

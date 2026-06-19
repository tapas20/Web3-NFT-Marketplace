"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["ALL", "AUTOMOTIVE", "WATCH", "PROPERTY"];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useProducts({
    category: activeCategory !== "ALL" ? activeCategory : undefined,
    limit: 50,
  });

  const products = data?.products || [];
  
  // Client-side search filtering (for simplicity)
  const filteredProducts = products.filter((p: any) => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-24 pb-16">
      {/* Header Section */}
      <section className="container-custom mb-12">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Explore Marketplace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Discover exclusive luxury assets available for purchase via smart contracts.
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="container-custom mb-10 sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`rounded-full shrink-0 ${activeCategory === category ? "shadow-glow" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category === "ALL" ? "All Items" : category}
              </Button>
            ))}
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              className="pl-9 h-11 rounded-full bg-secondary/50 border-transparent focus-visible:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container-custom">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/10 rounded-3xl border border-destructive/20 text-destructive">
            <p>Failed to load products. Please try again.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-secondary/30 rounded-3xl border border-border">
            <h3 className="text-2xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filters.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("ALL");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

"use client";

import NextLink from "next/link";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    images: string[];
    location: string;
    category: string;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { data: wishlistData } = useWishlist();
  const { mutate: toggleWishlist, isPending } = useToggleWishlist();

  const isWishlisted = wishlistData?.wishlist?.some(
    (item: any) => item.productId === product.id
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass rounded-2xl overflow-hidden hover-lift h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <NextLink href={`/explore/${product.slug}`}>
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </NextLink>
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            disabled={isPending}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"
              }`}
            />
          </Button>

          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-background/80 backdrop-blur-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-2 mb-2">
            <NextLink href={`/explore/${product.slug}`} className="hover:underline">
              <h3 className="font-semibold line-clamp-1">{product.title}</h3>
            </NextLink>
            <p className="font-bold text-primary shrink-0">${product.price.toLocaleString()}</p>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mt-auto pt-4">
            <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useWishlist() {
  const { status } = useSession();
  
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json();
    },
    enabled: status === "authenticated",
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to toggle wishlist");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

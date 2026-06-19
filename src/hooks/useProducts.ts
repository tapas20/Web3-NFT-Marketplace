import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseProductsOptions {
  category?: string | null;
  status?: string;
  sellerId?: string;
  page?: number;
  limit?: number;
}

export function useProducts(options?: UseProductsOptions) {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.category) params.append("category", options.category);
      if (options?.status) params.append("status", options.status);
      if (options?.sellerId) params.append("sellerId", options.sellerId);
      if (options?.page) params.append("page", options.page.toString());
      if (options?.limit) params.append("limit", options.limit.toString());

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      const res = await fetch(`/api/products/${idOrSlug}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    enabled: !!idOrSlug,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to create product");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update product");
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
}

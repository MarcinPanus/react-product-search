import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchProducts } from "../api/products";

export function useProducts(search: string, category: string, page: number) {
  return useQuery({
    queryKey: ["products", search, category, page],

    queryFn: ({ queryKey }) => {
      const search = queryKey[1] as string;
      const category = queryKey[2] as string;
      const page = queryKey[3] as number;

      return fetchProducts(search, category, page);
    },

    placeholderData: keepPreviousData,
    staleTime: 5000,
    gcTime: 10000,
  });
}

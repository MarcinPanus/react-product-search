import type { Product, ProductsResponse } from "../types/products";

export async function fetchProductsSearch(query: string, page: number): Promise<ProductsResponse> {
  const limit = 10;
  const skip = (page - 1) * limit;

  const response = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function fetchProduct(id: string | undefined): Promise<Product> {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function updateProductPrice(id: string | undefined, newPrice: number) {
  const response = await fetch(`https://dummyjson.com/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price: newPrice,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update product price");
  }

  return response.json();
}

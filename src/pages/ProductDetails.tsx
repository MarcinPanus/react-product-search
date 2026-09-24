import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { fetchProduct, updateProductPrice } from "../api/products";
import type { Product, UpdatePriceVariables } from "../types/products";

function ProductDetails() {
  const { productId } = useParams();

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: ({ queryKey }) => {
      const productId = queryKey[1];
      return fetchProduct(productId);
    },
    enabled: productId !== undefined,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, newPrice }: UpdatePriceVariables) => {
      return updateProductPrice(id, newPrice);
    },

    onSuccess: (_, variables) => {
      queryClient.setQueryData(["product", variables.id], (oldData: Product | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          price: variables.newPrice,
        };
      });
    },
  });

  return (
    <main>
      {isLoading && <p>Loading...</p>}
      {isFetching && !isLoading && <p>Updating...</p>}
      {error && <p>Error: {error.message}</p>}

      {data && (
        <div>
          <h1>{data.title}</h1>
          <img src={data.thumbnail} alt={data.title} />
          <p>{data.description}</p>

          <p>
            {data.price}

            <button
              disabled={isPending}
              onClick={() =>
                mutate({
                  id: productId!,
                  newPrice: data.price + 10,
                })
              }
            >
              {isPending ? "Updating..." : "Increase price"}
            </button>
          </p>

          <p>{data.rating}</p>
          <p>{data.stock}</p>
          <p>{data.category}</p>
        </div>
      )}

      <Link to="/">← Back to products</Link>
    </main>
  );
}

export default ProductDetails;

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchProductsSearch } from "./api/products";
import { useDebounce } from "./hooks/useDebounce";
import { Link } from "react-router";

const PRODUCTS_PER_PAGE = 10;

function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isFetching, isLoading, error } = useQuery({
    queryKey: ["products", debouncedSearch, page],

    queryFn: ({ queryKey }) => {
      const searchTerm = queryKey[1] as string;
      const page = queryKey[2] as number;

      return fetchProductsSearch(searchTerm, page);
    },

    placeholderData: keepPreviousData,
    enabled: debouncedSearch.length > 0,
    staleTime: 5000,
    gcTime: 10000,
  });

  const totalPages = data ? Math.ceil(data.total / PRODUCTS_PER_PAGE) : 0;

  return (
    <main>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for the products..." />
      <h1>Products:</h1>

      {!debouncedSearch && <p>Start typing to search for products.</p>}
      {isLoading && <p>Loading...</p>}
      {isFetching && !isLoading && <p>Updating...</p>}
      {error && <p>Error: {error.message}</p>}

      {data && (
        <>
          <ul>
            {data.products.map((product) => (
              <li key={product.id}>
                <Link to={`/products/${product.id}`}>
                  {product.title} — ${product.price}
                </Link>
              </li>
            ))}
          </ul>
          <div>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default App;

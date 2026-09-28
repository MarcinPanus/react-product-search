import { useState } from "react";
import { Link } from "react-router";
import { useProducts } from "./hooks/useProducts";
import { useDebounce } from "./hooks/useDebounce";

const PRODUCTS_PER_PAGE = 10;

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isFetching, isLoading, error } = useProducts(debouncedSearch, category, page);

  const totalPages = data ? Math.ceil(data.total / PRODUCTS_PER_PAGE) : 0;

  return (
    <main>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search for the products..."
      />

      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All categories</option>
        <option value="smartphones">Smartphones</option>
        <option value="laptops">Laptops</option>
        <option value="fragrances">Fragrances</option>
        <option value="groceries">Groceries</option>
      </select>

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
            <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default App;

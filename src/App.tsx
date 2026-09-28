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
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search for the products..."
          />
          <div className="relative w-full sm:w-64">
            <select
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">↓</span>
          </div>
        </div>
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Products</h1>
        {isLoading && <p>Loading...</p>}
        {isFetching && !isLoading && <p>Updating...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.products.map((product) => (
                <li key={product.id} className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <Link to={`/products/${product.id}`}>
                    <img src={product.thumbnail} alt={product.title} className="aspect-square w-full object-contain p-6" />
                    <div className="p-5">
                      <h2 className="mb-2 text-lg font-semibold text-gray-900">{product.title}</h2>

                      <p className="mb-4 text-sm text-gray-500">{product.description}</p>

                      <p className="text-xl font-bold text-blue-600">${product.price}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="text-sm font-medium text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default App;

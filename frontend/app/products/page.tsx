import api from '@/lib/api';
import { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';

interface SearchParams {
  search?: string;
  category?: string;
  gender?: string;
  frameType?: string;
  shape?: string;
  lensType?: string;
  minPrice?: string;
  maxPrice?: string;
  blueLightFilter?: string;
  prescriptionSupported?: string;
  uvProtection?: string;
  featured?: string;
  sort?: string;
  page?: string;
}

async function getProducts(params: SearchParams) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
    const { data } = await api.get(`/products?${query.toString()}`);
    return data as { products: Product[]; total: number; pages: number; page: number };
  } catch {
    return { products: [], total: 0, pages: 1, page: 1 };
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await api.get('/products/categories');
    return data;
  } catch {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const [{ products, total, pages, page }, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Frames</h1>
        <p className="text-gray-500 mt-1">{total} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <FilterSidebar categories={categories} currentParams={params} />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <div className="text-5xl mb-4">🕶️</div>
              <p className="text-lg font-medium">No frames found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

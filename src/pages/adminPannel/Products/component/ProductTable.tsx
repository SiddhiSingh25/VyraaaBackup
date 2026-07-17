import { Edit2, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductTableProps } from "./types";

const ProductTable = ({
  items,
  search,
  onSearch,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2]">
      {/* Search */}

      <div className="border-b border-[#D8C4B5] p-4">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-3 text-[#9B7B69]" />

          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="h-10 w-full rounded-lg border border-[#E3D3C4] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#8B5E49]"
          />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#D8C4B5] bg-[#FFF8F2] text-left text-sm font-semibold text-[#8B5E49]">
              <th className="px-4 py-3 w-20">Sr. No.</th>

              <th className="w-[320px] px-4 py-3">Product</th>

              <th className="px-4 py-3">Category</th>

              <th className="px-4 py-3">Color</th>

              <th className="px-4 py-3">Variants</th>

              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>

              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((product, index) => {
              const lowestPrice = Math.min(
                ...product.price.map((x) => x.amount),
              );

              const variantSizes = product.price.map((x) => x.size).join(", ");

              const inStock = product.price.some((x) => x.isAvailable);

              return (
                <tr
                  key={product._id}
                  className="border-b border-[#EFE4DB] hover:bg-[#FFFDFB] transition-colors"
                >
                  {/* Sr No */}

                  <td className="px-4 py-3 text-sm text-[#5E4637]">
                    {index + 1}
                  </td>

                  {/* Product */}

                  {/* Product */}

                  <td className="w-[320px] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-12 w-12 shrink-0 rounded-lg border border-[#E4D6CB] object-cover"
                      />

                      <div className="min-w-0 max-w-60">
                        <p
                          className="overflow-hidden text-sm font-medium leading-5 text-[#3F322B]"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {product.title}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span>{product.brand?.brand}</span>
                          <span>•</span>
                          <span>{product.gender}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}

                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#473A33]">
                      {product.category}
                    </p>

                    <p className="text-xs text-slate-500">
                      {product.subCategory}
                    </p>
                  </td>

                  {/* Color */}

                  <td className="px-4 py-3">
                    <span className="rounded bg-[#F6ECE5] px-2 py-1 text-xs font-medium text-[#7C5945]">
                      {product.color}
                    </span>
                  </td>

                  {/* Variants */}

                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">
                        {product.price.length} Variants
                      </p>

                      <p className="mt-1 text-xs text-slate-500 truncate max-w-30">
                        {variantSizes}
                      </p>
                    </div>
                  </td>

                  {/* Price */}

                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#6F4A36]">
                      ₹{lowestPrice}
                    </p>

                    <p className="text-xs text-slate-500">Starting Price</p>
                  </td>

                  {/* Stock */}

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          inStock ? "bg-green-500" : "bg-red-500"
                        }`}
                      />

                      <span
                        className={`text-xs font-medium ${
                          inStock ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="rounded-md border border-[#E4D8CE] bg-white p-2 hover:bg-[#F8F3EF]"
                      >
                        <Edit2 size={15} className="text-[#7A5442]" />
                      </button>

                      <button
                        onClick={() => onDelete(product)}
                        className="rounded-md border border-[#F2D6D6] bg-white p-2 hover:bg-red-50"
                      >
                        <Trash2 size={15} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-[#E8D8CC] px-4 py-3 text-sm text-[#8B5E49]">
        <p>
          Showing <b>{items.length}</b> entries
        </p>

        <div className="flex items-center gap-2">
          <button className="rounded border border-[#E5D7CC] p-1 hover:bg-white">
            <ChevronLeft size={16} />
          </button>

          <button className="rounded bg-[#7B523B] px-3 py-1 text-white">
            1
          </button>

          <button className="rounded border border-[#E5D7CC] p-1 hover:bg-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import ProductTable from "./component/ProductTable";

import type { ProductItem } from "./component/types";
import Button from "@/components/tableComponents/Button";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

const Product = () => {
  const [search, setSearch] = useState("");
  const [products, SetProducts] = useState([]);
  const { getQuery } = useGetQuery();

  const fetchProducts = () => {
    getQuery({
      url: apiUrls.Product.getAll,
      onSuccess: (res: any) => {
        console.log("Fetched Addresses:", res.data);
        SetProducts(res.data);
      },
      onFail: (err: any) => {
        console.log("Failed to fetch addresses:", err);
      },
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item: any) => {
      return (
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [products, search]);

  const handleEdit = (item: ProductItem) => {
    console.log("Edit", item);
  };

  const handleDelete = (item: ProductItem) => {
    console.log("Delete", item);
  };

  return (
    <div className="h-screen bg-slate-50 font-admin-text text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage and organize all products across the system.
            </p>
          </div>

          <Button variant="primary" size="md" icon={<Plus size={18} />}>
            Add Product
          </Button>
        </div>

        <ProductTable
          items={filteredProducts}
          search={search}
          onSearch={setSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Product;

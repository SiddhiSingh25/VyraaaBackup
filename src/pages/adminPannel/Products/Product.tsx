import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import ProductTable from "./component/ProductTable";

import type { ProductItem, ProductPagination } from "./component/types";
import Button from "@/components/tableComponents/Button";
import ConfirmDialog from "@/components/tableComponents/ConfirmDialog";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { useNavigate } from "react-router-dom";
import usePostQuery from "@/hooks/postQuery.hook";

const Product = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ProductPagination>({
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });
  const [pendingDelete, setPendingDelete] = useState<ProductItem | null>(null);
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const navigate = useNavigate();

  const fetchProducts = () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pagination.limit.toString(),
    });

    if (search) params.set("search", search);

    getQuery({
      url: `${apiUrls.Product.getAll}?${params.toString()}`,
      onSuccess: (res: any) => {
        setProducts(res.data || []);
        setPagination(
          res.pagination || {
            totalProducts: 0,
            totalPages: 1,
            currentPage: page,
            limit: pagination.limit,
          },
        );
      },
      onFail: (err: any) => {
        console.log("Failed to fetch addresses:", err);
      },
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEdit = (item: ProductItem) => {
    console.log("Edit", item._id);

    navigate(`/admin/quick-add/${item._id}`);
  };

  const handleView = (item: ProductItem) => {
    navigate(`/productDetails/${item._id}`);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    postQuery({
      url: apiUrls.Product.delete,
      postData: {
        id: pendingDelete._id,
      },
      onSuccess: (res: any) => {
        console.log(res);
        setPendingDelete(null);
        fetchProducts();
      },
      onFail: (err: any) => {
        console.log(err, "Error creating brand");
      },
    });
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

          <Button
            onClick={() => navigate("/admin/quick-add")}
            variant="primary"
            size="md"
            icon={<Plus size={18} />}
          >
            Add Product
          </Button>
        </div>

        <ProductTable
          items={products}
          search={search}
          onSearch={handleSearch}
          pagination={pagination}
          onPageChange={setPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={setPendingDelete}
        />
      </div>

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete product?"
        description={
          pendingDelete
            ? `Are you sure you want to delete \"${pendingDelete.title}\"? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default Product;

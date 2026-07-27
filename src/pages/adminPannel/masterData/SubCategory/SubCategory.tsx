import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/tableComponents/Button";
import ConfirmDialog from "../../../../components/tableComponents/ConfirmDialog";
import SubCategoryTable from "./component/SubCategoryTable";
import SubCategoryFormModal from "./component/SubCategoryFormModal";
import type { SubCategory, SubCategoryFormValues, ModalMode } from "./component/types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import usePutQuery from "../../../../hooks/putQuery.hook";
import useDeleteQuery from "../../../../hooks/deleteQuery.hook";
import { apiUrls } from "../../../../apis/index";
import PageLoader from "@/components/Loader/fullPageLoader";

export default function SubCategory() {
  const [rawItems, setRawItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SubCategory | null>(null);

  const { getQuery, loading } = useGetQuery();
  const { postQuery, loading: addLoading } = usePostQuery();
  const { putQuery, loading: editLoading } = usePutQuery();
  const { deleteQuery, loading: deleteLoading } = useDeleteQuery();

  // 1. Fetch ONLY Subcategories on initial mount
  useEffect(() => {
    getQuery({
      url: apiUrls.SubCategory.getAll,
      onSuccess: (res: any) => {
        setRawItems(res?.data || []);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Fetch Categories ONLY when requested (Lazy Loading)
  const fetchCategoriesIfNeeded = () => {
    if (categories.length === 0) {
      getQuery({
        url: apiUrls.Category.getAll,
        onSuccess: (res: any) => {
          const data = res?.data || [];
          setCategories(data.map((c: any) => ({ id: c._id, name: c.category })));
        },
      });
    }
  };

  // 3. Derived State
  const mappedItems: SubCategory[] = useMemo(() => {
    const categoryMap = categories.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {} as Record<string, string>);

    return rawItems.map((item, index) => ({
      id: item._id,
      srNo: index + 1,
      subCategory: item.subCategory,
      category: item.category,
      // Fallback to item.categoryName if backend provides it, otherwise use our map
      categoryName: item.categoryName || categoryMap[item.category] || "N/A",
    }));
  }, [rawItems, categories]);

  // 4. Trigger Category fetch when opening modals
  const openAdd = () => {
    setModalMode("add");
    setActiveItem(null);
    setIsFormOpen(true);
    fetchCategoriesIfNeeded(); // <--- Call here
  };

  const openEdit = (it: SubCategory) => {
    setModalMode("edit");
    setActiveItem(it);
    setIsFormOpen(true);
    fetchCategoriesIfNeeded(); // <--- Call here
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: SubCategoryFormValues) => {
    if (modalMode === "add") {
      await postQuery({
        url: apiUrls.SubCategory.add,
        postData: {
          category: values.category,
          subCategory: values.subCategory,
        },
        onSuccess: (res: any) => {
          if (res?.data) {
            setRawItems((prev) => [...prev, res.data]);
            setIsFormOpen(false);
          }
        },
      });
    } else if (activeItem) {
      await putQuery({
        url: apiUrls.SubCategory.update,
        putData: { id: activeItem.id, subCategory: values.subCategory },
        onSuccess: (res: any) => {
          if (res?.data) {
            setRawItems((prev) =>
              prev.map((p) => (p._id === res.data._id ? res.data : p))
            );
            setIsFormOpen(false);
          }
        },
      });
    }
  };

  const requestDelete = (it: SubCategory) => setPendingDelete(it);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({
      url: apiUrls.SubCategory.delete,
      deleteData: { id: pendingDelete.id },
      onSuccess: () => {
        setRawItems((prev) => prev.filter((p) => p._id !== pendingDelete.id));
        setPendingDelete(null);
      },
    });
  };

  return (
    <div className="h-screen bg-slate-50 font-admin-text text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-admin-text font-bold tracking-tight text-slate-900">
              Subcategory Management
            </h1>
            <p className="mt-2 text-sm font-admin-text text-slate-500">
              Manage subcategories and bind them to categories.
            </p>
          </div>
          <Button
            onClick={openAdd}
            variant="primary"
            className="font-admin-text bg-dark"
            size="md"
            icon={<Plus size={18} strokeWidth={2.5} />}
          >
            Add Subcategory
          </Button>
        </div>

        {loading && <PageLoader loading={loading} text="Loading Subcategories..." />}

        <div className="p-0 sm:p-2 mb-4">
          <SubCategoryTable
            items={mappedItems}
            onEdit={openEdit}
            onDelete={requestDelete}
          />
        </div>
      </div>

      <SubCategoryFormModal
        isOpen={isFormOpen}
        mode={modalMode}
        categories={categories}
        initialData={activeItem ?? null}
        onClose={closeForm}
        onSubmit={handleSubmit}
        loading={modalMode === "add" ? addLoading : editLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete subcategory?"
        description={
          pendingDelete
            ? `This will permanently remove "${pendingDelete.subCategory}".`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
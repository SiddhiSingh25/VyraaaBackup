import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/tableComponents/Button";
import ConfirmDialog from "../../../../components/tableComponents/ConfirmDialog";
import SubCategoryTable from "./component/SubCategoryTable";
import SubCategoryFormModal from "./component/SubCategoryFormModal";
import type {
  SubCategory,
  SubCategoryFormValues,
  ModalMode,
} from "./component/types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import usePutQuery from "../../../../hooks/putQuery.hook";
import useDeleteQuery from "../../../../hooks/deleteQuery.hook";
import { apiUrls } from "../../../../apis/index";
import PageLoader from "@/components/Loader/fullPageLoader";

const mapApi = (item: any): SubCategory => ({
  id: item._id,
  srNo: 0,
  subCategory: item.subCategory,
  category: item.category,
});

export default function SubCategory() {
  const [items, setItems] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SubCategory | null>(null);

  const { getQuery, loading } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const fetchCategories = () => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        setCategories(data.map((c: any) => ({ id: c._id, name: c.category })));
      },
    });
  };

  const fetchSubcategories = () => {
    getQuery({
      url: apiUrls.SubCategory.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        setItems(
          data.map(mapApi).map((it: SubCategory, idx: number) => ({
            ...it,
            srNo: idx + 1,
            categoryName:
              categories.find((c) => c.id === it.category)?.name || "",
          })),
        );
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchSubcategories();
  }, [categories]);

  const openAdd = () => {
    setModalMode("add");
    setActiveItem(null);
    setIsFormOpen(true);
  };
  const openEdit = (it: SubCategory) => {
    setModalMode("edit");
    setActiveItem(it);
    setIsFormOpen(true);
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
          const newItem = res?.data;
          if (!newItem) return;
          setItems((prev) =>
            prev.concat({
              ...mapApi(newItem),
              srNo: prev.length + 1,
              categoryName:
                categories.find((c) => c.id === newItem.category)?.name || "",
            }),
          );
          setIsFormOpen(false);
        },
      });
    } else if (activeItem) {
      await putQuery({
        url: apiUrls.SubCategory.update,
        putData: { id: activeItem.id, subCategory: values.subCategory },
        onSuccess: (res: any) => {
          const updated = res?.data;
          if (!updated) return;
          setItems((prev) =>
            prev.map((p) =>
              p.id === updated._id
                ? { ...p, subCategory: updated.subCategory }
                : p,
            ),
          );
          setIsFormOpen(false);
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
        setItems((prev) => prev.filter((p) => p.id !== pendingDelete.id));
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

        {loading && (
          <PageLoader loading={loading} text="Loading Subcategories..." />
        )}

        <div className="p-0 sm:p-2 mb-4">
          <SubCategoryTable
            items={items}
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
      />
    </div>
  );
}

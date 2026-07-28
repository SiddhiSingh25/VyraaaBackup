import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/tableComponents/Button";
import ConfirmDialog from "../../../../components/tableComponents/ConfirmDialog";
import SubCategoryTypeTable from "./component/SubCategoryTypeTable";
import SubCategoryTypeFormModal from "./component/SubCategoryTypeFormModal";
import type {
  SubCategoryType,
  SubCategoryTypeFormValues,
  ModalMode,
} from "./component/types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import usePutQuery from "../../../../hooks/putQuery.hook";
import useDeleteQuery from "../../../../hooks/deleteQuery.hook";
import { apiUrls } from "../../../../apis/index";
import PageLoader from "@/components/Loader/fullPageLoader";

// 1. OPTIMIZATION: Pass index to mapApi to handle srNo in a single pass
// and use the subCategoryName directly from the API response
const mapApi = (item: any, idx: number): SubCategoryType => ({
  id: item._id,
  srNo: idx + 1,
  subCategory: item.subCategory,
  subCategoryName: item.subCategoryName || "",
  type: item.type,
});

export default function SubCategoryTypePage() {
  const [items, setItems] = useState<SubCategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [activeItem, setActiveItem] = useState<SubCategoryType | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SubCategoryType | null>(null);

  const { getQuery, loading } = useGetQuery();
  const { postQuery, loading: addLoading } = usePostQuery();
  const { putQuery, loading: editLoading } = usePutQuery();
  const { deleteQuery, loading: deleteLoading } = useDeleteQuery();

  // LAZY LOAD: Wrap in useCallback, only call API if array is empty
  const fetchSubcategoriesIfNeeded = useCallback(() => {
    if (subcategories.length === 0) {
      getQuery({
        url: apiUrls.SubCategory.getByCategoryId.replace("getByCategoryId", "getAll") || apiUrls.SubCategory.getByCategoryId,
        onSuccess: (res: any) => {
          const data = res?.data || [];
          setSubcategories(
            data.map((s: any) => ({
              id: s._id,
              name: s.subCategory || s.subCategoryName,
            }))
          );
        },
      });
    }
  }, [subcategories.length, getQuery]);

  // Wrapped in useCallback to prevent infinite re-renders
  const fetchItems = useCallback(() => {
    getQuery({
      url: apiUrls.SubCategoryType.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        // 2. OPTIMIZATION: Replaced double .map() and expensive .find() loop with a single map
        setItems(data.map((it: any, idx: number) => mapApi(it, idx)));
      },
    });
  }, [getQuery]);

  // INITIAL MOUNT: ONLY fetch items. Do NOT fetch subcategories yet.
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openAdd = () => {
    setModalMode("add");
    setActiveItem(null);
    setIsFormOpen(true);
    fetchSubcategoriesIfNeeded(); // <-- Trigger lazy load here
  };

  const openEdit = (it: SubCategoryType) => {
    setModalMode("edit");
    setActiveItem(it);
    setIsFormOpen(true);
    fetchSubcategoriesIfNeeded(); // <-- Trigger lazy load here
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: SubCategoryTypeFormValues) => {
    if (modalMode === "add") {
      await postQuery({
        url: apiUrls.SubCategoryType.add,
        postData: { subCategory: values.subCategory, type: values.type },
        onSuccess: (res: any) => {
          const newItem = res?.data;
          if (!newItem) return;

          setItems((prev) => [
            ...prev,
            {
              ...mapApi(newItem, prev.length),
              // We only need to manually find the name on newly added items before page refresh
              subCategoryName: subcategories.find((s) => s.id === newItem.subCategory)?.name || "",
            }
          ]);
          closeForm();
        },
      });
    } else if (activeItem) {
      await putQuery({
        url: apiUrls.SubCategoryType.update,
        putData: { id: activeItem.id, subCategory: values.subCategory, type: values.type },
        onSuccess: (res: any) => {
          const updated = res?.data;
          if (!updated) return;

          setItems((prev) =>
            prev.map((p) =>
              p.id === updated._id
                ? {
                  ...p,
                  type: updated.type,
                  subCategory: updated.subCategory,
                  subCategoryName: subcategories.find((s) => s.id === updated.subCategory)?.name || p.subCategoryName
                }
                : p
            )
          );
          closeForm();
        },
      });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({
      url: apiUrls.SubCategoryType.delete,
      deleteData: { id: pendingDelete.id },
      onSuccess: () => {
        setItems((prev) => prev.filter((p) => p.id !== pendingDelete.id));
        setPendingDelete(null);
      },
    });
  };

  return (
    <div className="h-screen bg-slate-50 font-admin-text text-slate-900">
      {loading && <PageLoader loading={loading} text="Loading Subcategory Types" />}

      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Subcategory Type Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">Manage subcategory types.</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md" icon={<Plus size={18} strokeWidth={2.5} />}>
            Add Type
          </Button>
        </div>

        <div className="p-0 sm:p-2 mb-4">
          <SubCategoryTypeTable items={items} onEdit={openEdit} onDelete={setPendingDelete} />
        </div>
      </div>

      <SubCategoryTypeFormModal
        isOpen={isFormOpen}
        mode={modalMode}
        subcategories={subcategories}
        initialData={activeItem ?? null}
        onClose={closeForm}
        onSubmit={handleSubmit}
        loading={modalMode === "add" ? addLoading : editLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete entry?"
        description={pendingDelete ? "This will permanently remove this entry." : ""}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
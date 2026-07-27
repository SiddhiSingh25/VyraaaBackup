import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/tableComponents/Button";
import ConfirmDialog from "../../../../components/tableComponents/ConfirmDialog";
import PropertyTable from "./component/PropertyTable";
import PropertyFormModal from "./component/PropertyFormModal";
import type {
  PropertyItem,
  PropertyFormValues,
  ModalMode,
} from "./component/types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import usePutQuery from "../../../../hooks/putQuery.hook";
import useDeleteQuery from "../../../../hooks/deleteQuery.hook";
import { apiUrls } from "../../../../apis/index";
import PageLoader from "@/components/Loader/fullPageLoader";

// 1. Optimized mapApi: Takes index to handle SrNo and grabs subCategoryName directly from API
const mapApi = (item: any, index: number): PropertyItem => ({
  id: item._id,
  srNo: index + 1,
  property: item.property,
  subCategory: item.subCategory,
  subCategoryName: item.subCategoryName || "",
});

export default function PropertyPage() {
  const [items, setItems] = useState<PropertyItem[]>([]);
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PropertyItem | null>(null);

  const { getQuery, loading } = useGetQuery();
  const { postQuery, loading: addLoading } = usePostQuery();
  const { putQuery, loading: editLoading } = usePutQuery();
  const { deleteQuery, loading: deleteLoading } = useDeleteQuery();

  // LAZY LOAD: Wrap in useCallback, only call API if array is empty
  const fetchSubcategoriesIfNeeded = useCallback(() => {
    if (subcategories.length === 0) {
      getQuery({
        url: apiUrls.SubCategory.getAll,
        onSuccess: (res: any) => {
          const data = res?.data || [];
          setSubcategories(
            data.map((s: any) => ({ id: s._id, name: s.subCategory }))
          );
        },
      });
    }
  }, [subcategories.length, getQuery]);

  // Wrap in useCallback to satisfy dependency rules
  const fetchItems = useCallback(() => {
    getQuery({
      url: apiUrls.Property.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        // 2. Simplified Mapping: Rely on API response instead of local array `.find()`
        setItems(data.map((item: any, idx: number) => mapApi(item, idx)));
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

  const openEdit = (it: PropertyItem) => {
    setModalMode("edit");
    setActiveItem(it);
    setIsFormOpen(true);
    fetchSubcategoriesIfNeeded(); // <-- Trigger lazy load here
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: PropertyFormValues) => {
    if (modalMode === "add") {
      await postQuery({
        url: apiUrls.Property.add,
        postData: {
          subCategory: values.subCategory,
          property: values.property,
        },
        onSuccess: (res: any) => {
          const newItem = res?.data;
          if (!newItem) return;

          setItems((prev) => [
            ...prev,
            {
              ...mapApi(newItem, prev.length),
              // Fallback just in case your POST response doesn't populate the name instantly
              subCategoryName: newItem.subCategoryName || subcategories.find(s => s.id === newItem.subCategory)?.name || "",
            }
          ]);
          setIsFormOpen(false);
        },
      });
    } else if (activeItem) {
      await putQuery({
        url: apiUrls.Property.update,
        putData: {
          id: activeItem.id,
          subCategory: values.subCategory,
          property: values.property,
        },
        onSuccess: (res: any) => {
          const updated = res?.data;
          if (!updated) return;

          setItems((prev) =>
            prev.map((p) =>
              p.id === updated._id ? {
                ...p,
                property: updated.property,
                subCategory: updated.subCategory,
                // Update name if they changed subcategories
                subCategoryName: updated.subCategoryName || subcategories.find(s => s.id === updated.subCategory)?.name || p.subCategoryName
              } : p
            )
          );
          setIsFormOpen(false);
        },
      });
    }
  };

  const requestDelete = (it: PropertyItem) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({
      url: apiUrls.Property.delete,
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Property Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage property types bound to subcategories.
            </p>
          </div>
          <Button
            onClick={openAdd}
            variant="primary"
            size="md"
            icon={<Plus size={18} strokeWidth={2.5} />}
          >
            Add Property
          </Button>
        </div>

        {loading && (
          <PageLoader loading={loading} text="Loading Properties..." />
        )}

        <div className="p-0 sm:p-2 mb-4">
          <PropertyTable
            items={items}
            onEdit={openEdit}
            onDelete={requestDelete}
          />
        </div>
      </div>

      <PropertyFormModal
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
        title="Delete property?"
        description={
          pendingDelete
            ? `This will permanently remove "${pendingDelete.property}".`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
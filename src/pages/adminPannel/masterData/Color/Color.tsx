import { useEffect, useState, useCallback } from "react"; // <-- Added useCallback
import { Plus } from "lucide-react";
import Button from "../../../../components/tableComponents/Button";
import ConfirmDialog from "../../../../components/tableComponents/ConfirmDialog";
import ColorTable from "./component/ColorTable";
import ColorFormModal from "./component/ColorFormModal";
import type { ColorItem, ColorFormValues, ModalMode } from "./component/types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import usePutQuery from "../../../../hooks/putQuery.hook";
import useDeleteQuery from "../../../../hooks/deleteQuery.hook";
import { apiUrls } from "../../../../apis/index";
import PageLoader from "@/components/Loader/fullPageLoader";

// 1. OPTIMIZATION: Pass index to handle srNo, and grab familyName natively from API
const mapApi = (item: any, index: number): ColorItem => ({
  id: item._id,
  srNo: index + 1,
  color: item.color,
  hexCode: item.hexCode,
  family: item.family,
  familyName: item.familyName || "",
});

export default function ColorPage() {
  const [items, setItems] = useState<ColorItem[]>([]);
  const [families, setFamilies] = useState<{ id: string; name: string }[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [activeItem, setActiveItem] = useState<ColorItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ColorItem | null>(null);

  const { getQuery, loading } = useGetQuery();
  const { postQuery, loading: addLoading } = usePostQuery();
  const { putQuery, loading: editLoading } = usePutQuery();
  const { deleteQuery, loading: deleteLoading } = useDeleteQuery();

  // LAZY LOAD: Wrap in useCallback, only call API if array is empty
  const fetchFamiliesIfNeeded = useCallback(() => {
    if (families.length === 0) {
      getQuery({
        url: apiUrls.ColorFamily.getAll,
        onSuccess: (res: any) => {
          const data = res?.data || [];
          setFamilies(data.map((f: any) => ({ id: f._id, name: f.colorFamily })));
        },
      });
    }
  }, [families.length, getQuery]);

  // Wrap in useCallback to satisfy dependency rules
  const fetchItems = useCallback(() => {
    getQuery({
      url: apiUrls.Color.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        setItems(data.map((it: any, idx: number) => mapApi(it, idx)));
      },
    });
  }, [getQuery]);

  // INITIAL MOUNT: ONLY fetch items. Do NOT fetch families yet.
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openAdd = () => {
    setModalMode("add");
    setActiveItem(null);
    setIsFormOpen(true);
    fetchFamiliesIfNeeded(); // <-- Trigger lazy load here
  };

  const openEdit = (it: ColorItem) => {
    setModalMode("edit");
    setActiveItem(it);
    setIsFormOpen(true);
    fetchFamiliesIfNeeded(); // <-- Trigger lazy load here
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: ColorFormValues) => {
    if (modalMode === "add") {
      await postQuery({
        url: apiUrls.Color.add,
        postData: {
          family: values.family,
          color: values.color,
          hexCode: values.hexCode,
        },
        onSuccess: (res: any) => {
          const newItem = res?.data;
          if (!newItem) return;

          setItems((prev) => [
            ...prev,
            {
              ...mapApi(newItem, prev.length),
              familyName: families.find((f) => f.id === newItem.family)?.name || "",
            },
          ]);
          setIsFormOpen(false);
        },
      });
    } else if (activeItem) {
      await putQuery({
        url: apiUrls.Color.update,
        putData: {
          id: activeItem.id,
          family: values.family,
          color: values.color,
          hexCode: values.hexCode,
        },
        onSuccess: (res: any) => {
          const updated = res?.data;
          if (!updated) return;

          setItems((prev) =>
            prev.map((p) =>
              p.id === updated._id
                ? {
                  ...p,
                  color: updated.color,
                  hexCode: updated.hexCode,
                  family: updated.family,
                  familyName: families.find((f) => f.id === updated.family)?.name || p.familyName,
                }
                : p
            )
          );
          setIsFormOpen(false);
        },
      });
    }
  };

  const requestDelete = (it: ColorItem) => setPendingDelete(it);

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    await deleteQuery({
      url: apiUrls.Color.delete,
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
              Color Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage colors and hex codes.
            </p>
          </div>
          <Button
            onClick={openAdd}
            variant="primary"
            size="md"
            icon={<Plus size={18} strokeWidth={2.5} />}
          >
            Add Color
          </Button>
        </div>

        {loading && <PageLoader loading={loading} text="Loading Colors..." />}

        <div className="p-0 sm:p-2 ">
          <ColorTable
            items={items}
            onEdit={openEdit}
            onDelete={requestDelete}
          />
        </div>
      </div>

      <ColorFormModal
        isOpen={isFormOpen}
        mode={modalMode}
        families={families}
        initialData={activeItem ?? null}
        onClose={closeForm}
        onSubmit={handleSubmit}
        loading={modalMode === "add" ? addLoading : editLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete color?"
        description={
          pendingDelete
            ? `This will permanently remove "${pendingDelete.color}".`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
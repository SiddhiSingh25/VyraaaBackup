import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/tableComponents/Button";
import ConfirmDialog from "../../../../components/tableComponents/ConfirmDialog";
import SizeTable from "./component/SizeTable";
import SizeFormModal from "./component/SizeFormModal";
import type { SizeItem, SizeFormValues, ModalMode } from "./component/types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import usePutQuery from "../../../../hooks/putQuery.hook";
import useDeleteQuery from "../../../../hooks/deleteQuery.hook";
import { apiUrls } from "../../../../apis/index";
import PageLoader from "@/components/Loader/fullPageLoader";

// OPTIMIZATION 1: Map everything in a single pass using the backend's provided 'sizeTypeName'
const mapApi = (item: any, idx: number): SizeItem => ({
  id: item._id,
  srNo: idx + 1,
  size: item.size,
  sizeType: item.sizeType,
  sizeTypeName: item.sizeTypeName || "", // Use backend data! No need to find() from sizeTypes state
});

export default function SizePage() {
  const [items, setItems] = useState<SizeItem[]>([]);
  const [sizeTypes, setSizeTypes] = useState<{ id: string; name: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SizeItem | null>(null);

  const { getQuery, loading } = useGetQuery();
  const { postQuery, loading: addLoading } = usePostQuery();
  const { putQuery, loading: editLoading } = usePutQuery();
  const { deleteQuery, loading: deleteLoading } = useDeleteQuery();

  const fetchItems = () => {
    getQuery({
      url: apiUrls.Size.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        // Map items exactly once
        setItems(data.map((item: any, idx: number) => mapApi(item, idx)));
      },
    });
  };

  const fetchSizeTypes = () => {
    getQuery({
      url: apiUrls.SizeType.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        setSizeTypes(data.map((s: any) => ({ id: s._id, name: s.sizeType })));
      },
    });
  };

  // OPTIMIZATION 2: Only fetch the table items on mount (No dependency array waterfall).
  useEffect(() => {
    fetchItems();
  }, []);

  // OPTIMIZATION 3: Lazy Load Dropdown Data. 
  // Only fetch the `sizeTypes` list if the user opens the modal AND we haven't fetched them yet.
  useEffect(() => {
    if (isFormOpen && sizeTypes.length === 0) {
      fetchSizeTypes();
    }
  }, [isFormOpen, sizeTypes.length]);

  const openAdd = () => {
    setModalMode("add");
    setActiveItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (it: SizeItem) => {
    setModalMode("edit");
    setActiveItem(it);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: SizeFormValues) => {
    if (modalMode === "add") {
      await postQuery({
        url: apiUrls.Size.add,
        postData: { sizeType: values.sizeType, size: values.size },
        onSuccess: (res: any) => {
          const newItem = res?.data;
          if (!newItem) return;

          setItems((prev) => [
            ...prev,
            {
              id: newItem._id,
              srNo: prev.length + 1,
              size: newItem.size,
              sizeType: newItem.sizeType,
              // Fallback to our loaded sizeTypes for immediate optimistic UI update
              sizeTypeName: sizeTypes.find((s) => s.id === newItem.sizeType)?.name || "",
            }
          ]);
          setIsFormOpen(false);
        },
      });
    } else if (activeItem) {
      await putQuery({
        url: apiUrls.Size.update,
        putData: {
          id: activeItem.id,
          sizeType: values.sizeType,
          size: values.size,
        },
        onSuccess: (res: any) => {
          const updated = res?.data;
          if (!updated) return;
          setItems((prev) =>
            prev.map((p) =>
              p.id === updated._id ? {
                ...p,
                size: updated.size,
                sizeType: updated.sizeType,
                sizeTypeName: sizeTypes.find((s) => s.id === updated.sizeType)?.name || p.sizeTypeName
              } : p,
            ),
          );
          setIsFormOpen(false);
        },
      });
    }
  };

  const requestDelete = (it: SizeItem) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({
      url: apiUrls.Size.delete,
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
              Size Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage sizes and size types.
            </p>
          </div>
          <Button
            onClick={openAdd}
            variant="primary"
            size="md"
            icon={<Plus size={18} strokeWidth={2.5} />}
          >
            Add Size
          </Button>
        </div>

        {loading && <PageLoader loading={loading} text="Loading Sizes..." />}

        <div className="p-0 sm:p-2 mb-4">
          <SizeTable items={items} onEdit={openEdit} onDelete={requestDelete} />
        </div>
      </div>

      <SizeFormModal
        isOpen={isFormOpen}
        mode={modalMode}
        sizeTypes={sizeTypes}
        initialData={activeItem ?? null}
        onClose={closeForm}
        onSubmit={handleSubmit}
        loading={modalMode === "add" ? addLoading : editLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete size?"
        description={
          pendingDelete
            ? `This will permanently remove "${pendingDelete.size}".`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
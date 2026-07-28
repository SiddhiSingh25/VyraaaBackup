import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/tableComponents/Button";
import ConfirmDialog from "../../../../components/tableComponents/ConfirmDialog";
import PropertyValuesTable from "./component/PropertyValuesTable";
import PropertyValuesFormModal from "./component/PropertyValuesFormModal";
import type {
  PropertyValueItem,
  PropertyValueFormValues,
  ModalMode,
} from "./component/types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import usePutQuery from "../../../../hooks/putQuery.hook";
import useDeleteQuery from "../../../../hooks/deleteQuery.hook";
import { apiUrls } from "../../../../apis/index";
import PageLoader from "@/components/Loader/fullPageLoader";

// OPTIMIZATION 1: Map everything in a single pass using the backend's provided 'propertyName'
const mapApi = (item: any, idx: number): PropertyValueItem => ({
  id: item._id,
  srNo: idx + 1, // Calculate Sr No directly here
  property: item.property,
  propertyName: item.propertyName || "", // Use backend data! No need to find() from properties state
  value: item.value,
});

export default function PropertyValuesPage() {
  const [items, setItems] = useState<PropertyValueItem[]>([]);
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PropertyValueItem | null>(null);

  const { getQuery, loading } = useGetQuery();
  const { postQuery, loading: addLoading } = usePostQuery();
  const { putQuery, loading: editLoading } = usePutQuery();
  const { deleteQuery, loading: deleteLoading } = useDeleteQuery();

  const fetchItems = () => {
    getQuery({
      url: apiUrls.PropertyValues.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        // Map items exactly once
        setItems(data.map((item: any, idx: number) => mapApi(item, idx)));
      },
    });
  };

  const fetchProperties = () => {
    getQuery({
      url: apiUrls.Property.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        setProperties(data.map((s: any) => ({ id: s._id, name: s.property })));
      },
    });
  };

  // OPTIMIZATION 2: Only fetch the table items on mount.
  useEffect(() => {
    fetchItems();
  }, []);

  // OPTIMIZATION 3: Lazy Load Dropdown Data. 
  // Only fetch the `properties` list if the user opens the modal AND we haven't fetched them yet.
  useEffect(() => {
    if (isFormOpen && properties.length === 0) {
      fetchProperties();
    }
  }, [isFormOpen, properties.length]);

  const openAdd = () => {
    setModalMode("add");
    setActiveItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (it: PropertyValueItem) => {
    setModalMode("edit");
    setActiveItem(it);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: PropertyValueFormValues) => {
    if (modalMode === "add") {
      await postQuery({
        url: apiUrls.PropertyValues.add,
        postData: { property: values.property, value: values.value },
        onSuccess: (res: any) => {
          const newItem = res?.data;
          if (!newItem) return;

          setItems((prev) => [
            ...prev,
            {
              id: newItem._id,
              srNo: prev.length + 1,
              property: newItem.property,
              value: newItem.value,
              // Fallback to our loaded properties for immediate optimistic UI update
              propertyName: properties.find((s) => s.id === newItem.property)?.name || "",
            }
          ]);
          setIsFormOpen(false);
        },
      });
    } else if (activeItem) {
      await putQuery({
        url: apiUrls.PropertyValues.update,
        putData: {
          id: activeItem.id,
          property: values.property,
          value: values.value,
        },
        onSuccess: (res: any) => {
          const updated = res?.data;
          if (!updated) return;
          setItems((prev) =>
            prev.map((p) =>
              p.id === updated._id ? {
                ...p,
                value: updated.value,
                property: updated.property,
                propertyName: properties.find((s) => s.id === updated.property)?.name || p.propertyName
              } : p,
            ),
          );
          setIsFormOpen(false);
        },
      });
    }
  };

  const requestDelete = (it: PropertyValueItem) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({
      url: apiUrls.PropertyValues.delete,
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
              Property Values
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage values for properties.
            </p>
          </div>
          <Button
            onClick={openAdd}
            variant="primary"
            size="md"
            icon={<Plus size={18} strokeWidth={2.5} />}
          >
            Add Value
          </Button>
        </div>

        {loading && (
          <PageLoader loading={loading} text="Loading Property Values..." />
        )}

        <div className="p-0 sm:p-2 mb-4">
          <PropertyValuesTable
            items={items}
            onEdit={openEdit}
            onDelete={requestDelete}
          />
        </div>
      </div>

      <PropertyValuesFormModal
        isOpen={isFormOpen}
        mode={modalMode}
        properties={properties}
        initialData={activeItem ?? null}
        onClose={closeForm}
        onSubmit={handleSubmit}
        loading={modalMode === "add" ? addLoading : editLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete value?"
        description={
          pendingDelete
            ? `This will permanently remove "${pendingDelete.value}".`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
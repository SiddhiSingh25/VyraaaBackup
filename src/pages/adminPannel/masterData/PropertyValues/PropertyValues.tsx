import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../Category/component/Button';
import ConfirmDialog from '../Category/component/ConfirmDialog';
import PropertyValuesTable from './component/PropertyValuesTable';
import PropertyValuesFormModal from './component/PropertyValuesFormModal';
import type { PropertyValueItem, PropertyValueFormValues, ModalMode } from './component/types';
import useGetQuery from '../../../../hooks/getQuery.hook';
import usePostQuery from '../../../../hooks/postQuery.hook';
import usePutQuery from '../../../../hooks/putQuery.hook';
import useDeleteQuery from '../../../../hooks/deleteQuery.hook';
import { apiUrls } from '../../../../apis/index';

const mapApi = (item: any): PropertyValueItem => ({ id: item._id, srNo: 0, property: item.property, value: item.value });

export default function PropertyValuesPage() {
  const [items, setItems] = useState<PropertyValueItem[]>([]);
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PropertyValueItem | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const fetchProperties = () => {
    getQuery({ url: apiUrls.Property.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setProperties(data.map((s: any) => ({ id: s._id, name: s.property })));
    }});
  };

  const fetchItems = () => {
    getQuery({ url: apiUrls.PropertyValues.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setItems(data.map(mapApi).map((it: PropertyValueItem, idx: number) => ({ ...it, srNo: idx + 1, propertyName: properties.find(s => s.id === it.property)?.name || '' })));
    }});
  };

  useEffect(() => { fetchProperties(); }, []);
  useEffect(() => { fetchItems(); }, [properties]);

  const openAdd = () => { setModalMode('add'); setActiveItem(null); setIsFormOpen(true); };
  const openEdit = (it: PropertyValueItem) => { setModalMode('edit'); setActiveItem(it); setIsFormOpen(true); };
  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: PropertyValueFormValues) => {
    if (modalMode === 'add') {
      await postQuery({ url: apiUrls.PropertyValues.add, postData: { property: values.property, value: values.value }, onSuccess: (res: any) => {
        const newItem = res?.data; if (!newItem) return;
        setItems((prev) => prev.concat({ ...mapApi(newItem), srNo: prev.length + 1, propertyName: properties.find(s => s.id === newItem.property)?.name || '' }));
        setIsFormOpen(false);
      }});
    } else if (activeItem) {
      await putQuery({ url: apiUrls.PropertyValues.update, putData: { id: activeItem.id, property: values.property, value: values.value }, onSuccess: (res: any) => {
        const updated = res?.data; if (!updated) return;
        setItems((prev) => prev.map((p) => p.id === updated._id ? { ...p, value: updated.value } : p));
        setIsFormOpen(false);
      }});
    }
  };

  const requestDelete = (it: PropertyValueItem) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({ url: apiUrls.PropertyValues.delete, deleteData: { id: pendingDelete.id }, onSuccess: () => {
      setItems((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      setPendingDelete(null);
    }});
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Property Values</h1>
            <p className="mt-2 text-sm text-slate-500">Manage values for properties.</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md" icon={<Plus size={18} strokeWidth={2.5} />}>Add Value</Button>
        </div>

        <div className="p-0 sm:p-2">
          <PropertyValuesTable items={items} onEdit={openEdit} onDelete={requestDelete} />
        </div>
      </div>

      <PropertyValuesFormModal isOpen={isFormOpen} mode={modalMode} properties={properties} initialData={activeItem ?? null} onClose={closeForm} onSubmit={handleSubmit} />

      <ConfirmDialog isOpen={Boolean(pendingDelete)} title="Delete value?" description={pendingDelete ? `This will permanently remove "${pendingDelete.value}".` : ''} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  );
}

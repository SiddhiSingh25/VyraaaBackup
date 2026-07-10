import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../Category/component/Button';
import ConfirmDialog from '../Category/component/ConfirmDialog';
import PropertyTable from './component/PropertyTable';
import PropertyFormModal from './component/PropertyFormModal';
import type { PropertyItem, PropertyFormValues, ModalMode } from './component/types';
import useGetQuery from '../../../../hooks/getQuery.hook';
import usePostQuery from '../../../../hooks/postQuery.hook';
import usePutQuery from '../../../../hooks/putQuery.hook';
import useDeleteQuery from '../../../../hooks/deleteQuery.hook';
import { apiUrls } from '../../../../apis/index';

const mapApi = (item: any): PropertyItem => ({ id: item._id, srNo: 0, property: item.property, subCategory: item.subCategory });

export default function PropertyPage() {
  const [items, setItems] = useState<PropertyItem[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PropertyItem | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const fetchSubcategories = () => {
    getQuery({ url: apiUrls.SubCategory.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setSubcategories(data.map((s: any) => ({ id: s._id, name: s.subCategory })));
    }});
  };

  const fetchItems = () => {
    getQuery({ url: apiUrls.Property.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setItems(data.map(mapApi).map((it: PropertyItem, idx: number) => ({ ...it, srNo: idx + 1, subCategoryName: subcategories.find(s => s.id === it.subCategory)?.name || '' })));
    }});
  };

  useEffect(() => { fetchSubcategories(); }, []);
  useEffect(() => { fetchItems(); }, [subcategories]);

  const openAdd = () => { setModalMode('add'); setActiveItem(null); setIsFormOpen(true); };
  const openEdit = (it: PropertyItem) => { setModalMode('edit'); setActiveItem(it); setIsFormOpen(true); };
  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: PropertyFormValues) => {
    if (modalMode === 'add') {
      await postQuery({ url: apiUrls.Property.add, postData: { subCategory: values.subCategory, property: values.property }, onSuccess: (res: any) => {
        const newItem = res?.data; if (!newItem) return;
        setItems((prev) => prev.concat({ ...mapApi(newItem), srNo: prev.length + 1, subCategoryName: subcategories.find(s => s.id === newItem.subCategory)?.name || '' }));
        setIsFormOpen(false);
      }});
    } else if (activeItem) {
      await putQuery({ url: apiUrls.Property.update, putData: { id: activeItem.id, subCategory: values.subCategory, property: values.property }, onSuccess: (res: any) => {
        const updated = res?.data; if (!updated) return;
        setItems((prev) => prev.map((p) => p.id === updated._id ? { ...p, property: updated.property } : p));
        setIsFormOpen(false);
      }});
    }
  };

  const requestDelete = (it: PropertyItem) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({ url: apiUrls.Property.delete, deleteData: { id: pendingDelete.id }, onSuccess: () => {
      setItems((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      setPendingDelete(null);
    }});
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Property Management</h1>
            <p className="mt-2 text-sm text-slate-500">Manage property types bound to subcategories.</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md" icon={<Plus size={18} strokeWidth={2.5} />}>Add Property</Button>
        </div>

        <div className="p-0 sm:p-2">
          <PropertyTable items={items} onEdit={openEdit} onDelete={requestDelete} />
        </div>
      </div>

      <PropertyFormModal isOpen={isFormOpen} mode={modalMode} subcategories={subcategories} initialData={activeItem ?? null} onClose={closeForm} onSubmit={handleSubmit} />

      <ConfirmDialog isOpen={Boolean(pendingDelete)} title="Delete property?" description={pendingDelete ? `This will permanently remove "${pendingDelete.property}".` : ''} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  );
}

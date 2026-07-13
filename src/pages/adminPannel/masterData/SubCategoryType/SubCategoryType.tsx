import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../Category/component/Button';
import ConfirmDialog from '../Category/component/ConfirmDialog';
import SubCategoryTypeTable from './component/SubCategoryTypeTable';
import SubCategoryTypeFormModal from './component/SubCategoryTypeFormModal';
import type { SubCategoryType, SubCategoryTypeFormValues, ModalMode } from './component/types';
import useGetQuery from '../../../../hooks/getQuery.hook';
import usePostQuery from '../../../../hooks/postQuery.hook';
import usePutQuery from '../../../../hooks/putQuery.hook';
import useDeleteQuery from '../../../../hooks/deleteQuery.hook';
import { apiUrls } from '../../../../apis/index';

const mapApi = (item: any): SubCategoryType => ({ id: item._id, srNo: 0, subCategory: item.subCategory, type: item.type });

export default function SubCategoryTypePage() {
  const [items, setItems] = useState<SubCategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SubCategoryType | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const fetchSubcategories = () => {
    getQuery({ url: apiUrls.SubCategory.getByCategoryId.replace('getByCategoryId', 'getAll') || apiUrls.SubCategory.getByCategoryId, onSuccess: (res: any) => {
      // fallback: use Category.getAll if specific endpoint is absent
      const data = res?.data || [];
      setSubcategories(data.map((s: any) => ({ id: s._id, name: s.subCategory || s.subCategory })));
    }});
  };

  const fetchItems = () => {
    getQuery({ url: apiUrls.SubCategoryType.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setItems(data.map(mapApi).map((it: SubCategoryType, idx: number) => ({
        ...it,
        srNo: idx + 1,
        subCategoryName: subcategories.find((s) => s.id === it.subCategory)?.name || '',
      })));
    }});
  };

  useEffect(() => { fetchSubcategories(); }, []);
  useEffect(() => { fetchItems(); }, [subcategories]);

  const openAdd = () => { setModalMode('add'); setActiveItem(null); setIsFormOpen(true); };
  const openEdit = (it: SubCategoryType) => { setModalMode('edit'); setActiveItem(it); setIsFormOpen(true); };
  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: SubCategoryTypeFormValues) => {
    if (modalMode === 'add') {
      await postQuery({ url: apiUrls.SubCategoryType.add, postData: { subCategory: values.subCategory, type: values.type }, onSuccess: (res: any) => {
        const newItem = res?.data; if (!newItem) return;
        setItems((prev) => prev.concat({ ...mapApi(newItem), srNo: prev.length + 1, subCategoryName: subcategories.find(s => s.id === newItem.subCategory)?.name || '' }));
        setIsFormOpen(false);
      }});
    } else if (activeItem) {
      await putQuery({ url: apiUrls.SubCategoryType.update, putData: { id: activeItem.id, subCategory: values.subCategory, type: values.type }, onSuccess: (res: any) => {
        const updated = res?.data; if (!updated) return;
        setItems((prev) => prev.map((p) => p.id === updated._id ? { ...p, type: updated.type } : p));
        setIsFormOpen(false);
      }});
    }
  };

  const requestDelete = (it: SubCategoryType) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({ url: apiUrls.SubCategoryType.delete, deleteData: { id: pendingDelete.id }, onSuccess: () => {
      setItems((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      setPendingDelete(null);
    }});
  };

  return (
    <div className="h-screen bg-slate-50 font-admin-text text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subcategory Type Management</h1>
            <p className="mt-2 text-sm text-slate-500">Manage subcategory types.</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md" icon={<Plus size={18} strokeWidth={2.5} />}>Add Type</Button>
        </div>

        <div className="p-0 sm:p-2 mb-4">
          <SubCategoryTypeTable items={items} onEdit={openEdit} onDelete={requestDelete} />
        </div>
      </div>

      <SubCategoryTypeFormModal isOpen={isFormOpen} mode={modalMode} subcategories={subcategories} initialData={activeItem ?? null} onClose={closeForm} onSubmit={handleSubmit} />

      <ConfirmDialog isOpen={Boolean(pendingDelete)} title="Delete entry?" description={pendingDelete ? `This will permanently remove this entry.` : ''} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../Category/component/Button';
import ConfirmDialog from '../Category/component/ConfirmDialog';
import SizeTypeTable from './component/SizeTypeTable';
import SizeTypeFormModal from './component/SizeTypeFormModal';
import type { SizeTypeItem, SizeTypeFormValues, ModalMode } from './component/types';
import useGetQuery from '../../../../hooks/getQuery.hook';
import usePostQuery from '../../../../hooks/postQuery.hook';
import usePutQuery from '../../../../hooks/putQuery.hook';
import useDeleteQuery from '../../../../hooks/deleteQuery.hook';
import { apiUrls } from '../../../../apis/index';

const mapApi = (item: any): SizeTypeItem => ({ id: item._id, srNo: 0, sizeType: item.sizeType || item.sizeType });

export default function SizeTypePage() {
  const [items, setItems] = useState<SizeTypeItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SizeTypeItem | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const fetchItems = () => {
    getQuery({ url: apiUrls.SizeType.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setItems(data.map(mapApi).map((it: SizeTypeItem, idx: number) => ({ ...it, srNo: idx + 1 })));
    }});
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setModalMode('add'); setActiveItem(null); setIsFormOpen(true); };
  const openEdit = (it: SizeTypeItem) => { setModalMode('edit'); setActiveItem(it); setIsFormOpen(true); };
  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: SizeTypeFormValues) => {
    if (modalMode === 'add') {
      await postQuery({ url: apiUrls.SizeType.add, postData: { sizeType: values.sizeType }, onSuccess: (res: any) => {
        const newItem = res?.data; if (!newItem) return;
        setItems((prev) => prev.concat({ ...mapApi(newItem), srNo: prev.length + 1 }));
        setIsFormOpen(false);
      }});
    } else if (activeItem) {
      await putQuery({ url: apiUrls.SizeType.update, putData: { id: activeItem.id, sizeType: values.sizeType }, onSuccess: (res: any) => {
        const updated = res?.data; if (!updated) return;
        setItems((prev) => prev.map((p) => p.id === updated._id ? { ...p, sizeType: updated.sizeType } : p));
        setIsFormOpen(false);
      }});
    }
  };

  const requestDelete = (it: SizeTypeItem) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({ url: apiUrls.SizeType.delete, deleteData: { id: pendingDelete.id }, onSuccess: () => {
      setItems((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      setPendingDelete(null);
    }});
  };

  return (
    <div className="h-screen bg-slate-50 font-admin-text text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Size Type Management</h1>
            <p className="mt-2 text-sm text-slate-500">Manage size types.</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md" icon={<Plus size={18} strokeWidth={2.5} />}>Add Size Type</Button>
        </div>

        <div className="p-0 sm:p-2 mb-4">
          <SizeTypeTable items={items} onEdit={openEdit} onDelete={requestDelete} />
        </div>
      </div>

      <SizeTypeFormModal isOpen={isFormOpen} mode={modalMode} initialData={activeItem ?? null} onClose={closeForm} onSubmit={handleSubmit} />

      <ConfirmDialog isOpen={Boolean(pendingDelete)} title="Delete size type?" description={pendingDelete ? `This will permanently remove "${pendingDelete.sizeType}".` : ''} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  );
}

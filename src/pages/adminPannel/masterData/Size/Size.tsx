import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../Category/component/Button';
import ConfirmDialog from '../Category/component/ConfirmDialog';
import SizeTable from './component/SizeTable';
import SizeFormModal from './component/SizeFormModal';
import type { SizeItem, SizeFormValues, ModalMode } from './component/types';
import useGetQuery from '../../../../hooks/getQuery.hook';
import usePostQuery from '../../../../hooks/postQuery.hook';
import usePutQuery from '../../../../hooks/putQuery.hook';
import useDeleteQuery from '../../../../hooks/deleteQuery.hook';
import { apiUrls } from '../../../../apis/index';

const mapApi = (item: any): SizeItem => ({ id: item._id, srNo: 0, size: item.size, sizeType: item.sizeType });

export default function SizePage() {
  const [items, setItems] = useState<SizeItem[]>([]);
  const [sizeTypes, setSizeTypes] = useState<{ id: string; name: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SizeItem | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const fetchSizeTypes = () => {
    getQuery({ url: apiUrls.SizeType.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setSizeTypes(data.map((s: any) => ({ id: s._id, name: s.sizeType })));
    }});
  };

  const fetchItems = () => {
    getQuery({ url: apiUrls.Size.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setItems(data.map(mapApi).map((it: SizeItem, idx: number) => ({ ...it, srNo: idx + 1, sizeTypeName: sizeTypes.find(s => s.id === it.sizeType)?.name || '' })));
    }});
  };

  useEffect(() => { fetchSizeTypes(); }, []);
  useEffect(() => { fetchItems(); }, [sizeTypes]);

  const openAdd = () => { setModalMode('add'); setActiveItem(null); setIsFormOpen(true); };
  const openEdit = (it: SizeItem) => { setModalMode('edit'); setActiveItem(it); setIsFormOpen(true); };
  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: SizeFormValues) => {
    if (modalMode === 'add') {
      await postQuery({ url: apiUrls.Size.add, postData: { sizeType: values.sizeType, size: values.size }, onSuccess: (res: any) => {
        const newItem = res?.data; if (!newItem) return;
        setItems((prev) => prev.concat({ ...mapApi(newItem), srNo: prev.length + 1, sizeTypeName: sizeTypes.find(s => s.id === newItem.sizeType)?.name || '' }));
        setIsFormOpen(false);
      }});
    } else if (activeItem) {
      await putQuery({ url: apiUrls.Size.update, putData: { id: activeItem.id, sizeType: values.sizeType, size: values.size }, onSuccess: (res: any) => {
        const updated = res?.data; if (!updated) return;
        setItems((prev) => prev.map((p) => p.id === updated._id ? { ...p, size: updated.size } : p));
        setIsFormOpen(false);
      }});
    }
  };

  const requestDelete = (it: SizeItem) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({ url: apiUrls.Size.delete, deleteData: { id: pendingDelete.id }, onSuccess: () => {
      setItems((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      setPendingDelete(null);
    }});
  };

  return (
    <div className="h-screen bg-slate-50 font-admin-text text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Size Management</h1>
            <p className="mt-2 text-sm text-slate-500">Manage sizes and size types.</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md" icon={<Plus size={18} strokeWidth={2.5} />}>Add Size</Button>
        </div>

        <div className="p-0 sm:p-2 mb-4">
          <SizeTable items={items} onEdit={openEdit} onDelete={requestDelete} />
        </div>
      </div>

      <SizeFormModal isOpen={isFormOpen} mode={modalMode} sizeTypes={sizeTypes} initialData={activeItem ?? null} onClose={closeForm} onSubmit={handleSubmit} />

      <ConfirmDialog isOpen={Boolean(pendingDelete)} title="Delete size?" description={pendingDelete ? `This will permanently remove "${pendingDelete.size}".` : ''} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  );
}

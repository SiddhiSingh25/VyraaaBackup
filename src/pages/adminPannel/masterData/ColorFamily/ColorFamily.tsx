import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../Category/component/Button';
import ConfirmDialog from '../Category/component/ConfirmDialog';
import ColorFamilyTable from './component/ColorFamilyTable';
import ColorFamilyFormModal from './component/ColorFamilyFormModal';
import type { ColorFamily, ColorFamilyFormValues, ModalMode } from './component/types';
import useGetQuery from '../../../../hooks/getQuery.hook';
import usePostQuery from '../../../../hooks/postQuery.hook';
import usePutQuery from '../../../../hooks/putQuery.hook';
import useDeleteQuery from '../../../../hooks/deleteQuery.hook';
import { apiUrls } from '../../../../apis/index';

const mapApi = (item: any): ColorFamily => ({ id: item._id, srNo: 0, colorFamily: item.colorFamily || item.colorFamily });

export default function ColorFamilyPage() {
  const [items, setItems] = useState<ColorFamily[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ColorFamily | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const fetchItems = () => {
    getQuery({ url: apiUrls.ColorFamily.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setItems(data.map(mapApi).map((it: ColorFamily, idx: number) => ({ ...it, srNo: idx + 1 })));
    }});
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setModalMode('add'); setActiveItem(null); setIsFormOpen(true); };
  const openEdit = (it: ColorFamily) => { setModalMode('edit'); setActiveItem(it); setIsFormOpen(true); };
  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: ColorFamilyFormValues) => {
    if (modalMode === 'add') {
      await postQuery({ url: apiUrls.ColorFamily.add, postData: { colorFamily: values.colorFamily }, onSuccess: (res: any) => {
        const newItem = res?.data; if (!newItem) return;
        setItems((prev) => prev.concat({ ...mapApi(newItem), srNo: prev.length + 1 }));
        setIsFormOpen(false);
      }});
    } else if (activeItem) {
      await putQuery({ url: apiUrls.ColorFamily.update, putData: { id: activeItem.id, colorFamily: values.colorFamily }, onSuccess: (res: any) => {
        const updated = res?.data; if (!updated) return;
        setItems((prev) => prev.map((p) => p.id === updated._id ? { ...p, colorFamily: updated.colorFamily } : p));
        setIsFormOpen(false);
      }});
    }
  };

  const requestDelete = (it: ColorFamily) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({ url: apiUrls.ColorFamily.delete, deleteData: { id: pendingDelete.id }, onSuccess: () => {
      setItems((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      setPendingDelete(null);
    }});
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Color Family Management</h1>
            <p className="mt-2 text-sm text-slate-500">Manage color families.</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md" icon={<Plus size={18} strokeWidth={2.5} />}>Add Color Family</Button>
        </div>

        <div className="p-0 sm:p-2">
          <ColorFamilyTable items={items} onEdit={openEdit} onDelete={requestDelete} />
        </div>
      </div>

      <ColorFamilyFormModal isOpen={isFormOpen} mode={modalMode} initialData={activeItem ?? null} onClose={closeForm} onSubmit={handleSubmit} />

      <ConfirmDialog isOpen={Boolean(pendingDelete)} title="Delete color family?" description={pendingDelete ? `This will permanently remove "${pendingDelete.colorFamily}".` : ''} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  );
}

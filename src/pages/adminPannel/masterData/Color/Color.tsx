import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../Category/component/Button';
import ConfirmDialog from '../Category/component/ConfirmDialog';
import ColorTable from './component/ColorTable';
import ColorFormModal from './component/ColorFormModal';
import type { ColorItem, ColorFormValues, ModalMode } from './component/types';
import useGetQuery from '../../../../hooks/getQuery.hook';
import usePostQuery from '../../../../hooks/postQuery.hook';
import usePutQuery from '../../../../hooks/putQuery.hook';
import useDeleteQuery from '../../../../hooks/deleteQuery.hook';
import { apiUrls } from '../../../../apis/index';

const mapApi = (item: any): ColorItem => ({ id: item._id, srNo: 0, color: item.color, hexCode: item.hexCode, family: item.family });

export default function ColorPage() {
  const [items, setItems] = useState<ColorItem[]>([]);
  const [families, setFamilies] = useState<{ id: string; name: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ColorItem | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const fetchFamilies = () => {
    getQuery({ url: apiUrls.ColorFamily.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setFamilies(data.map((f: any) => ({ id: f._id, name: f.colorFamily })));
    }});
  };

  const fetchItems = () => {
    getQuery({ url: apiUrls.Color.getAll, onSuccess: (res: any) => {
      const data = res?.data || [];
      setItems(data.map(mapApi).map((it: ColorItem, idx: number) => ({ ...it, srNo: idx + 1, familyName: families.find((f) => f.id === it.family)?.name || '' })));
    }});
  };

  useEffect(() => { fetchFamilies(); }, []);
  useEffect(() => { fetchItems(); }, [families]);

  const openAdd = () => { setModalMode('add'); setActiveItem(null); setIsFormOpen(true); };
  const openEdit = (it: ColorItem) => { setModalMode('edit'); setActiveItem(it); setIsFormOpen(true); };
  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = async (values: ColorFormValues) => {
    if (modalMode === 'add') {
      await postQuery({ url: apiUrls.Color.add, postData: { family: values.family, color: values.color, hexCode: values.hexCode }, onSuccess: (res: any) => {
        const newItem = res?.data; if (!newItem) return;
        setItems((prev) => prev.concat({ ...mapApi(newItem), srNo: prev.length + 1, familyName: families.find(f => f.id === newItem.family)?.name || '' }));
        setIsFormOpen(false);
      }});
    } else if (activeItem) {
      await putQuery({ url: apiUrls.Color.update, putData: { id: activeItem.id, family: values.family, color: values.color, hexCode: values.hexCode }, onSuccess: (res: any) => {
        const updated = res?.data; if (!updated) return;
        setItems((prev) => prev.map((p) => p.id === updated._id ? { ...p, color: updated.color, hexCode: updated.hexCode } : p));
        setIsFormOpen(false);
      }});
    }
  };

  const requestDelete = (it: ColorItem) => setPendingDelete(it);
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteQuery({ url: apiUrls.Color.delete, deleteData: { id: pendingDelete.id }, onSuccess: () => {
      setItems((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      setPendingDelete(null);
    }});
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Color Management</h1>
            <p className="mt-2 text-sm text-slate-500">Manage colors and hex codes.</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md" icon={<Plus size={18} strokeWidth={2.5} />}>Add Color</Button>
        </div>

        <div className="p-0 sm:p-2">
          <ColorTable items={items} onEdit={openEdit} onDelete={requestDelete} />
        </div>
      </div>

      <ColorFormModal isOpen={isFormOpen} mode={modalMode} families={families} initialData={activeItem ?? null} onClose={closeForm} onSubmit={handleSubmit} />

      <ConfirmDialog isOpen={Boolean(pendingDelete)} title="Delete color?" description={pendingDelete ? `This will permanently remove "${pendingDelete.color}".` : ''} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  );
}

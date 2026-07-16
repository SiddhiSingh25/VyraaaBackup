import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../../components/tableComponents/Button';
import ConfirmDialog from '../../../../components/tableComponents/ConfirmDialog';
import BrandTable from './component/BrandTable';
import BrandFormModal from './component/BrandFormModal';
import type { BrandItem, BrandFormValues, ModalMode } from './component/types';
import useGetQuery from '../../../../hooks/getQuery.hook';
import usePostQuery from '../../../../hooks/postQuery.hook';
import usePutQuery from '../../../../hooks/putQuery.hook';
import useDeleteQuery from '../../../../hooks/deleteQuery.hook';
import { apiUrls } from '../../../../apis/index';

const mapApi = (item: any): BrandItem => ({
  id: item._id,
  srNo: 0,
  brandName: item.brand,
  categoryId: item.category,
  categoryName: item.categoryName || '',
});

export default function BrandPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [activeBrand, setActiveBrand] = useState<BrandItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BrandItem | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const fetchCategories = () => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        setCategories(data.map((category: any) => ({ id: category._id, name: category.category })));
      },
    });
  };

  const fetchBrands = () => {
    getQuery({
      url: apiUrls.Brand.getAll,
      onSuccess: (res: any) => {
        const data = res?.data || [];
        setBrands(
          data
            .map(mapApi)
            .map((item: BrandItem, index: number) => ({
              ...item,
              srNo: index + 1,
              categoryName: categories.find((category) => category.id === item.categoryId)?.name || '',
            }))
        );
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

  const filteredBrands = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return brands;

    return brands.filter((item) =>
      [item.brandName, item.categoryName].join(' ').toLowerCase().includes(query)
    );
  }, [brands, searchTerm]);

  const openAddModal = () => {
    setModalMode('add');
    setActiveBrand(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: BrandItem) => {
    setModalMode('edit');
    setActiveBrand(item);
    setIsFormOpen(true);
  };

  const closeFormModal = () => setIsFormOpen(false);

  const handleFormSubmit = async (values: BrandFormValues) => {
    if (modalMode === 'add') {
      await postQuery({
        url: apiUrls.Brand.add,
        postData: { brand: values.brandName, category: values.categoryId },
        onSuccess: (res: any) => {
          const newItem = res?.data;
          if (!newItem) return;
          setBrands((prev) => [
            ...prev,
            {
              ...mapApi(newItem),
              srNo: prev.length + 1,
              categoryName: categories.find((category) => category.id === newItem.category)?.name || '',
            },
          ]);
          setIsFormOpen(false);
        },
      });
    } else if (activeBrand) {
      await putQuery({
        url: apiUrls.Brand.update,
        putData: { id: activeBrand.id, brand: values.brandName, category: values.categoryId },
        onSuccess: (res: any) => {
          const updated = res?.data;
          if (!updated) return;
          setBrands((prev) =>
            prev.map((item) =>
              item.id === updated._id
                ? {
                    ...item,
                    brandName: updated.brand,
                    categoryId: updated.category,
                    categoryName: categories.find((category) => category.id === updated.category)?.name || '',
                  }
                : item
            )
          );
          setIsFormOpen(false);
        },
      });
    }
  };

  const requestDelete = (item: BrandItem) => setPendingDelete(item);

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    await deleteQuery({
      url: apiUrls.Brand.delete,
      deleteData: { id: pendingDelete.id },
      onSuccess: () => {
        setBrands((prev) => prev.filter((item) => item.id !== pendingDelete.id));
        setPendingDelete(null);
      },
    });
  };

  return (
    <div className="h-screen bg-slate-50 font-admin-text text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Brand Management</h1>
            <p className="mt-2 text-sm text-slate-500">Create and manage brands with category assignment.</p>
          </div>
          <Button
            onClick={openAddModal}
            variant="primary"
            size="md"
            icon={<Plus size={18} strokeWidth={2.5} />}
          >
            Add Brand
          </Button>
        </div>

        <div className="p-0 sm:p-2 mb-4">
          <BrandTable
            brands={filteredBrands}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={openEditModal}
            onDelete={requestDelete}
          />
        </div>
      </div>

      <BrandFormModal
        isOpen={isFormOpen}
        mode={modalMode}
        categories={categories}
        initialData={activeBrand}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete brand?"
        description={
          pendingDelete
            ? `This will permanently remove "${pendingDelete.brandName}".`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

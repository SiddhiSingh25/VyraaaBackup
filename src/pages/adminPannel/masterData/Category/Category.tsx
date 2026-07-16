

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../../components/tableComponents/Button';
import SearchInput from '../../../../components/tableComponents/SearchInput';
import ConfirmDialog from '../../../../components/tableComponents/ConfirmDialog';
import type { Category, CategoryFormValues, ModalMode } from './component/types';
import CategoryTable from './component/CategoryTable';
import CategoryFormModal from './component/CategoryFormModal';
import useGetQuery from '../../../../hooks/getQuery.hook';
import usePostQuery from '../../../../hooks/postQuery.hook';
import usePutQuery from '../../../../hooks/putQuery.hook';
import useDeleteQuery from '../../../../hooks/deleteQuery.hook';
import { apiUrls } from '../../../../apis/index.ts';


interface ApiCategory {
  _id: string;
  category: string;
}

const mapApiCategory = (category: ApiCategory): Category => ({
  id: category._id,
  srNo: 0,
  categoryName: category.category,
  categoryHead: '',
  fatherName: '',
  cast: '',
  contact: '',
});

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const [categoryPendingDelete, setCategoryPendingDelete] = useState<Category | null>(null);

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { putQuery } = usePutQuery();
  const { deleteQuery } = useDeleteQuery();

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) =>
      [category.categoryName, category.categoryHead, category.fatherName, category.cast, category.contact]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [categories, searchTerm]);

  const visibleCategories = filteredCategories.slice(0, rowsPerPage);

  const openAddModal = () => {
    setModalMode('add');
    setActiveCategory(null);
    setIsFormOpen(true);
  };

  const openEditModal = (category: Category) => {
    setModalMode('edit');
    setActiveCategory(category);
    setIsFormOpen(true);
  };

  const closeFormModal = () => setIsFormOpen(false);

  const fetchCategories = () => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        const apiData: ApiCategory[] = res?.data || [];
        setCategories(
          apiData.map(mapApiCategory).map((category, index) => ({
            ...category,
            srNo: index + 1,
          }))
        );
      },
    });
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = async (values: CategoryFormValues) => {
    if (modalMode === 'add') {
      await postQuery({
        url: apiUrls.Category.add,
        postData: { category: values.categoryName },
        onSuccess: (res: any) => {
          const newCategory = res?.data;
          if (!newCategory) return;
          setCategories((prev) =>
            prev.concat({
              ...mapApiCategory(newCategory),
              srNo: prev.length + 1,
            })
          );
          setIsFormOpen(false);
        },
      });
    } else if (activeCategory) {
      await putQuery({
        url: apiUrls.Category.update,
        putData: { id: activeCategory.id, category: values.categoryName },
        onSuccess: (res: any) => {
          const updated = res?.data;
          if (!updated) return;
          setCategories((prev) =>
            prev.map((c) =>
              c.id === updated._id ? { ...c, categoryName: updated.category } : c
            )
          );
          setIsFormOpen(false);
        },
      });
    }
  };

  const requestDelete = (category: Category) => setCategoryPendingDelete(category);

  const confirmDelete = async () => {
    if (!categoryPendingDelete) return;
    await deleteQuery({
      url: apiUrls.Category.delete,
      deleteData: { id: categoryPendingDelete.id },
      onSuccess: () => {
        setCategories((prev) =>
          prev.filter((c) => c.id !== categoryPendingDelete.id)
        );
        setCategoryPendingDelete(null);
      },
    });
  };

  const cancelDelete = () => setCategoryPendingDelete(null);

  return (
    <div className="h-screen bg-slate-50 font-admin-text text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-4 py-4 ">
        
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-admin-text text-slate-900">
              Category Management
            </h1>
            <p className="mt-1 text-sm text-slate-700 font-admin-text">
              Manage and organize all categories across the system.
            </p>
          </div>
          <Button 
            onClick={openAddModal} 
            variant="primary" 
            size="md" 
            icon={<Plus size={18} strokeWidth={2.5} />} 
            className="shrink-0 font-admin-text self-start sm:self-auto bg-dark shadow-sm hover:shadow transition-shadow"
          >
            Add Category
          </Button>
        </div>

    
          {/* Table Area */}
          <div className="p-0 sm:p-2 mb-4">
            <CategoryTable 
              categories={visibleCategories} 
              onEdit={openEditModal} 
              onDelete={requestDelete} 
            />
          </div>
      </div>

      <CategoryFormModal
        isOpen={isFormOpen}
        mode={modalMode}
        initialData={activeCategory}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={Boolean(categoryPendingDelete)}
        title="Delete category?"
        description={
          categoryPendingDelete
            ? `This will permanently remove "${categoryPendingDelete.categoryName}". This action cannot be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
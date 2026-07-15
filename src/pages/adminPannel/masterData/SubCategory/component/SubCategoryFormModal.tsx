import { FormEvent, useEffect, useState } from 'react';
import Modal from '../../Category/component/Modal';
import Button from '../../Category/component/Button';
import type { SubCategoryFormValues, ModalMode } from './types';

interface Props {
  isOpen: boolean;
  mode: ModalMode;
  categories: { id: string; name: string }[];
  initialData?: SubCategoryFormValues | null;
  onClose: () => void;
  onSubmit: (values: SubCategoryFormValues) => void;
}

const EMPTY: SubCategoryFormValues = { category: '', subCategory: '' };

type Errors = Partial<Record<keyof SubCategoryFormValues, string>>;

export default function SubCategoryFormModal({ isOpen, mode, categories, initialData, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<SubCategoryFormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) setValues(initialData);
    else setValues(EMPTY);
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof SubCategoryFormValues) => (e: any) => {
    setValues((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.subCategory.trim()) next.subCategory = 'Subcategory is required';
    if (!values.category) next.category = 'Select a category';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add Subcategory' : 'Edit Subcategory'}
      description={mode === 'add' ? 'Create a new subcategory.' : 'Update subcategory details.'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button onClick={handleSubmit} type="submit" form="subcategory-form">{mode === 'add' ? 'Add' : 'Save'}</Button>
        </>
      }
    >
      <form id="subcategory-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Category</label>
          <select value={values.category} onChange={handleChange('category')} className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.category ? 'border-red-300' : 'border-dark-200'}`}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs font-medium text-red-500">{errors.category}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Subcategory</label>
          <input value={values.subCategory} onChange={handleChange('subCategory')} placeholder="e.g. T-Shirt" className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.subCategory ? 'border-red-300' : 'border-dark-200'}`} />
          {errors.subCategory && <p className="mt-1 text-xs font-medium text-red-500">{errors.subCategory}</p>}
        </div>
      </form>
    </Modal>
  );
}

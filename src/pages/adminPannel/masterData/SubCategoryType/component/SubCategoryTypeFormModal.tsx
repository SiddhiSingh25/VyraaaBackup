import { FormEvent, useEffect, useState } from 'react';
import Modal from '../../Category/component/Modal';
import Button from '../../Category/component/Button';
import type { SubCategoryTypeFormValues, ModalMode } from './types';

interface Props {
  isOpen: boolean;
  mode: ModalMode;
  subcategories: { id: string; name: string }[];
  initialData?: SubCategoryTypeFormValues | null;
  onClose: () => void;
  onSubmit: (values: SubCategoryTypeFormValues) => void;
}

const EMPTY: SubCategoryTypeFormValues = { subCategory: '', type: '' };

type Errors = Partial<Record<keyof SubCategoryTypeFormValues, string>>;

export default function SubCategoryTypeFormModal({ isOpen, mode, subcategories, initialData, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<SubCategoryTypeFormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) setValues(initialData);
    else setValues(EMPTY);
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof SubCategoryTypeFormValues) => (e: any) => {
    setValues((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.type.trim()) next.type = 'Type is required';
    if (!values.subCategory) next.subCategory = 'Select a subcategory';
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
      title={mode === 'add' ? 'Add Subcategory Type' : 'Edit Subcategory Type'}
      description={mode === 'add' ? 'Create a new subcategory type.' : 'Update type details.'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button onClick={handleSubmit} type="submit" form="subcat-type-form">{mode === 'add' ? 'Add' : 'Save'}</Button>
        </>
      }
    >
      <form id="subcat-type-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Subcategory</label>
          <select value={values.subCategory} onChange={handleChange('subCategory')} className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.subCategory ? 'border-red-300' : 'border-dark-200'}`}>
            <option value="">Select subcategory</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.subCategory && <p className="mt-1 text-xs font-medium text-red-500">{errors.subCategory}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Type</label>
          <input value={values.type} onChange={handleChange('type')} placeholder="e.g. Top" className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.type ? 'border-red-300' : 'border-dark-200'}`} />
          {errors.type && <p className="mt-1 text-xs font-medium text-red-500">{errors.type}</p>}
        </div>
      </form>
    </Modal>
  );
}

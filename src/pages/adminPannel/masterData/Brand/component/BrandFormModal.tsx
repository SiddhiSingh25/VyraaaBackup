import { FormEvent, useEffect, useState } from 'react';

import type { BrandItem, BrandFormValues, ModalMode } from './types';
import Button from '../../../../../components/tableComponents/Button';
import Modal from '../../../../../components/tableComponents/Modal';

interface BrandFormModalProps {
  isOpen: boolean;
  mode: ModalMode;
  categories: { id: string; name: string }[];
  initialData?: BrandItem | null;
  onClose: () => void;
  onSubmit: (values: BrandFormValues) => void;
}

const EMPTY_FORM: BrandFormValues = {
  brandName: '',
  categoryId: '',
};

type FormErrors = Partial<Record<keyof BrandFormValues, string>>;

export default function BrandFormModal({
  isOpen,
  mode,
  categories,
  initialData,
  onClose,
  onSubmit,
}: BrandFormModalProps) {
  const [values, setValues] = useState<BrandFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && initialData) {
      setValues({
        brandName: initialData.brandName,
        categoryId: initialData.categoryId,
      });
    } else {
      setValues(EMPTY_FORM);
    }

    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof BrandFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!values.brandName.trim()) nextErrors.brandName = 'Brand name is required';
    if (!values.categoryId) nextErrors.categoryId = 'Category is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
      title={mode === 'add' ? 'Add New Brand' : 'Edit Brand'}
      description={
        mode === 'add'
          ? 'Create a new brand and assign it to a category.'
          : 'Update the selected brand and its category.'
      }
      footer={
        <div className="flex gap-4 w-full justify-end font-admin-text">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" className="bg-dark">
            {mode === 'add' ? 'Add Brand' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <form id="brand-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 py-4">
        <div className="font-admin-text">
          <label htmlFor="brandName" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            Brand Name
          </label>
          <input
            id="brandName"
            type="text"
            value={values.brandName}
            onChange={handleChange('brandName')}
            placeholder="e.g. Nike"
            className={`w-full rounded-md px-4 h-12 text-sm outline-none transition-all duration-500 border bg-surface text-body placeholder:text-muted hover:bg-card focus:bg-background ${
              errors.brandName
                ? 'border-error/60 focus:border-error focus:ring-1 focus:ring-error/20'
                : 'border-border hover:border-primary-light focus:border-primary focus:ring-1 focus:ring-primary-light/30'
            }`}
          />
          {errors.brandName && <p className="mt-2 text-xs text-error">{errors.brandName}</p>}
        </div>

        <div className="font-admin-text">
          <label htmlFor="categoryId" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            Category
          </label>
          <select
            id="categoryId"
            value={values.categoryId}
            onChange={handleChange('categoryId')}
            className={`w-full rounded-md px-4 h-12 text-sm outline-none transition-all duration-500 border bg-surface text-body ${
              errors.categoryId
                ? 'border-error/60 focus:border-error focus:ring-1 focus:ring-error/20'
                : 'border-border hover:border-primary-light focus:border-primary focus:ring-1 focus:ring-primary-light/30'
            }`}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-2 text-xs text-error">{errors.categoryId}</p>}
        </div>
      </form>
    </Modal>
  );
}


import { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import type { Category, CategoryFormValues, ModalMode } from './types';

interface CategoryFormModalProps {
  isOpen: boolean;
  mode: ModalMode;
  initialData?: Category | null;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
}

const EMPTY_FORM: CategoryFormValues = {
  categoryName: '',
  categoryHead: '',
  fatherName: '',
  cast: '',
  contact: '',
};

type FormErrors = Partial<Record<keyof CategoryFormValues, string>>;

export default function CategoryFormModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [values, setValues] = useState<CategoryFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) {
      const { categoryName, categoryHead, fatherName, cast, contact } = initialData;
      setValues({ categoryName, categoryHead, fatherName, cast, contact });
    } else {
      setValues(EMPTY_FORM);
    }
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof CategoryFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!values.categoryName.trim()) nextErrors.categoryName = 'Category name is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  const fields: { key: keyof CategoryFormValues; label: string; placeholder: string }[] = [
    { key: 'categoryName', label: 'Category Name', placeholder: 'e.g. Bijnor Cities tf' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add New Category' : 'Edit Category'}
      description={
        mode === 'add' 
          ? 'Establish a new category record.' 
          : 'Refine the details for this category.'
      }
      footer={
        <div className="flex gap-4 w-full justify-end font-admin-text">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" form="category-form" className='bg-dark'>
            {mode === 'add' ? 'Add Category' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 py-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="relative font-admin-text">
            {/* Elegant, widely tracked label utilizing your muted color */}
            <label 
              htmlFor={key} 
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted"
            >
              {label}
            </label>
            
            {/* Input utilizing surface, card, body, border, and primary colors */}
            <input
              id={key}
              type={key === 'contact' ? 'tel' : 'text'}
              value={values[key]}
              onChange={handleChange(key)}
              placeholder={placeholder}
              className={`w-full rounded-md px-4 h-12 text-sm outline-none transition-all duration-500 border bg-surface text-body placeholder:text-muted hover:bg-card focus:bg-background ${
                errors[key] 
                  ? 'border-error/60 focus:border-error focus:ring-1 focus:ring-error/20' 
                  : 'border-border hover:border-primary-light focus:border-primary focus:ring-1 focus:ring-primary-light/30'
              }`}
            />
            
            {/* Error State utilizing your exact error color */}
            {errors[key] && (
              <p className="absolute -bottom-5 left-0 text-[10px] uppercase tracking-wider font-semibold text-error">
                {errors[key]}
              </p>
            )}
          </div>
        ))}
      </form>
    </Modal>
  );
}
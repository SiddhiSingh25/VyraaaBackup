import { FormEvent, useEffect, useState } from 'react';
import Modal from '../../Category/component/Modal';
import Button from '../../Category/component/Button';
import type { PropertyFormValues, ModalMode } from './types';

interface Props {
  isOpen: boolean;
  mode: ModalMode;
  subcategories: { id: string; name: string }[];
  initialData?: PropertyFormValues | null;
  onClose: () => void;
  onSubmit: (values: PropertyFormValues) => void;
}

const EMPTY: PropertyFormValues = { subCategory: '', property: '' };

type Errors = Partial<Record<keyof PropertyFormValues, string>>;

export default function PropertyFormModal({ isOpen, mode, subcategories, initialData, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<PropertyFormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) setValues(initialData);
    else setValues(EMPTY);
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof PropertyFormValues) => (e: any) => {
    setValues((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.property.trim()) next.property = 'Property is required';
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
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Property' : 'Edit Property'} description={mode === 'add' ? 'Create a new property.' : 'Update property.'} footer={<><Button variant="secondary" onClick={onClose} type="button">Cancel</Button><Button onClick={handleSubmit} type="submit" form="property-form">{mode === 'add' ? 'Add' : 'Save'}</Button></>}>
      <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Subcategory</label>
          <select value={values.subCategory} onChange={handleChange('subCategory')} className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.subCategory ? 'border-red-300' : 'border-dark-200'}`}>
            <option value="">Select subcategory</option>
            {subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.subCategory && <p className="mt-1 text-xs font-medium text-red-500">{errors.subCategory}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Property</label>
          <input value={values.property} onChange={handleChange('property')} placeholder="e.g. Fabric Type" className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.property ? 'border-red-300' : 'border-dark-200'}`} />
          {errors.property && <p className="mt-1 text-xs font-medium text-red-500">{errors.property}</p>}
        </div>
      </form>
    </Modal>
  );
}

import { FormEvent, useEffect, useState } from 'react';
import Modal from '../../../../../components/tableComponents/Modal';
import Button from '../../../../../components/tableComponents/Button';
import type { PropertyValueFormValues, ModalMode } from './types';

interface Props {
  isOpen: boolean;
  mode: ModalMode;
  properties: { id: string; name: string }[];
  initialData?: PropertyValueFormValues | null;
  onClose: () => void;
  onSubmit: (values: PropertyValueFormValues) => void;
}

const EMPTY: PropertyValueFormValues = { property: '', value: '' };

type Errors = Partial<Record<keyof PropertyValueFormValues, string>>;

export default function PropertyValuesFormModal({ isOpen, mode, properties, initialData, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<PropertyValueFormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) setValues(initialData);
    else setValues(EMPTY);
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof PropertyValueFormValues) => (e: any) => {
    setValues((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.value.trim()) next.value = 'Value is required';
    if (!values.property) next.property = 'Select a property';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Property Value' : 'Edit Property Value'} description={mode === 'add' ? 'Create a new property value.' : 'Update property value.'} footer={<><Button variant="secondary" onClick={onClose} type="button">Cancel</Button><Button onClick={handleSubmit} type="submit" form="propertyvalue-form">{mode === 'add' ? 'Add' : 'Save'}</Button></>}>
      <form id="propertyvalue-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Property</label>
          <select value={values.property} onChange={handleChange('property')} className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.property ? 'border-red-300' : 'border-dark-200'}`}>
            <option value="">Select property</option>
            {properties.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.property && <p className="mt-1 text-xs font-medium text-red-500">{errors.property}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Value</label>
          <input value={values.value} onChange={handleChange('value')} placeholder="e.g. Cotton" className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.value ? 'border-red-300' : 'border-dark-200'}`} />
          {errors.value && <p className="mt-1 text-xs font-medium text-red-500">{errors.value}</p>}
        </div>
      </form>
    </Modal>
  );
}

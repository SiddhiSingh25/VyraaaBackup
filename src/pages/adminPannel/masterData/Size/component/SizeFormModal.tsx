import { FormEvent, useEffect, useState } from 'react';
import Modal from '../../Category/component/Modal';
import Button from '../../Category/component/Button';
import type { SizeFormValues, ModalMode } from './types';

interface Props {
  isOpen: boolean;
  mode: ModalMode;
  sizeTypes: { id: string; name: string }[];
  initialData?: SizeFormValues | null;
  onClose: () => void;
  onSubmit: (values: SizeFormValues) => void;
}

const EMPTY: SizeFormValues = { sizeType: '', size: '' };

type Errors = Partial<Record<keyof SizeFormValues, string>>;

export default function SizeFormModal({ isOpen, mode, sizeTypes, initialData, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<SizeFormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) setValues(initialData);
    else setValues(EMPTY);
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof SizeFormValues) => (e: any) => {
    setValues((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.size.trim()) next.size = 'Size is required';
    if (!values.sizeType) next.sizeType = 'Select a size type';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Size' : 'Edit Size'} description={mode === 'add' ? 'Create a new size value.' : 'Update size.'} footer={<><Button variant="secondary" onClick={onClose} type="button">Cancel</Button><Button onClick={handleSubmit} type="submit" form="size-form">{mode === 'add' ? 'Add' : 'Save'}</Button></>}>
      <form id="size-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Size Type</label>
          <select value={values.sizeType} onChange={handleChange('sizeType')} className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.sizeType ? 'border-red-300' : 'border-dark-200'}`}>
            <option value="">Select size type</option>
            {sizeTypes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.sizeType && <p className="mt-1 text-xs font-medium text-red-500">{errors.sizeType}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Size</label>
          <input value={values.size} onChange={handleChange('size')} placeholder="e.g. XS" className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.size ? 'border-red-300' : 'border-dark-200'}`} />
          {errors.size && <p className="mt-1 text-xs font-medium text-red-500">{errors.size}</p>}
        </div>
      </form>
    </Modal>
  );
}

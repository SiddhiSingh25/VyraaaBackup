import { FormEvent, useEffect, useState } from 'react';
import Modal from '../../Category/component/Modal';
import Button from '../../Category/component/Button';
import type { SizeTypeFormValues, ModalMode } from './types';

interface Props {
  isOpen: boolean;
  mode: ModalMode;
  initialData?: SizeTypeFormValues | null;
  onClose: () => void;
  onSubmit: (values: SizeTypeFormValues) => void;
}

const EMPTY: SizeTypeFormValues = { sizeType: '' };

type Errors = Partial<Record<keyof SizeTypeFormValues, string>>;

export default function SizeTypeFormModal({ isOpen, mode, initialData, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<SizeTypeFormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) setValues(initialData);
    else setValues(EMPTY);
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof SizeTypeFormValues) => (e: any) => {
    setValues((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.sizeType.trim()) next.sizeType = 'Size type is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Size Type' : 'Edit Size Type'} description={mode === 'add' ? 'Create a new size type.' : 'Update size type.'} footer={<><Button variant="secondary" onClick={onClose} type="button">Cancel</Button><Button onClick={handleSubmit} type="submit" form="sizetype-form">{mode === 'add' ? 'Add' : 'Save'}</Button></>}>
      <form id="sizetype-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Size Type</label>
          <input value={values.sizeType} onChange={handleChange('sizeType')} placeholder="e.g. Measurements" className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.sizeType ? 'border-red-300' : 'border-dark-200'}`} />
          {errors.sizeType && <p className="mt-1 text-xs font-medium text-red-500">{errors.sizeType}</p>}
        </div>
      </form>
    </Modal>
  );
}

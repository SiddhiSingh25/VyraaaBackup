import { FormEvent, useEffect, useState } from 'react';
import Modal from '../../../../../components/tableComponents/Modal';
import Button from '../../../../../components/tableComponents/Button';
import type { ColorFamilyFormValues, ModalMode } from './types';

interface Props {
  isOpen: boolean;
  mode: ModalMode;
  initialData?: ColorFamilyFormValues | null;
  onClose: () => void;
  onSubmit: (values: ColorFamilyFormValues) => void;
}

const EMPTY: ColorFamilyFormValues = { colorFamily: '' };

type Errors = Partial<Record<keyof ColorFamilyFormValues, string>>;

export default function ColorFamilyFormModal({ isOpen, mode, initialData, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<ColorFamilyFormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) setValues(initialData);
    else setValues(EMPTY);
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof ColorFamilyFormValues) => (e: any) => {
    setValues((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.colorFamily.trim()) next.colorFamily = 'Color family is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Color Family' : 'Edit Color Family'} description={mode === 'add' ? 'Create a new color family.' : 'Update color family.'} footer={<><Button variant="secondary" onClick={onClose} type="button">Cancel</Button><Button onClick={handleSubmit} type="submit" form="colorfamily-form">{mode === 'add' ? 'Add' : 'Save'}</Button></>}>
      <form id="colorfamily-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Color Family</label>
          <input value={values.colorFamily} onChange={handleChange('colorFamily')} placeholder="e.g. Red" className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.colorFamily ? 'border-red-300' : 'border-dark-200'}`} />
          {errors.colorFamily && <p className="mt-1 text-xs font-medium text-red-500">{errors.colorFamily}</p>}
        </div>
      </form>
    </Modal>
  );
}

import { FormEvent, useEffect, useState } from 'react';
import Modal from '../../Category/component/Modal';
import Button from '../../Category/component/Button';
import type { ColorFormValues, ModalMode } from './types';

interface Props {
  isOpen: boolean;
  mode: ModalMode;
  families: { id: string; name: string }[];
  initialData?: ColorFormValues | null;
  onClose: () => void;
  onSubmit: (values: ColorFormValues) => void;
}

const EMPTY: ColorFormValues = { family: '', color: '', hexCode: '' };

type Errors = Partial<Record<keyof ColorFormValues, string>>;

export default function ColorFormModal({ isOpen, mode, families, initialData, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<ColorFormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) setValues(initialData);
    else setValues(EMPTY);
    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange = (field: keyof ColorFormValues) => (e: any) => {
    setValues((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.color.trim()) next.color = 'Color name is required';
    if (!values.family) next.family = 'Select a family';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Color' : 'Edit Color'} description={mode === 'add' ? 'Create a new color.' : 'Update color.'} footer={<><Button variant="secondary" onClick={onClose} type="button">Cancel</Button><Button onClick={handleSubmit} type="submit" form="color-form">{mode === 'add' ? 'Add' : 'Save'}</Button></>}>
      <form id="color-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Family</label>
          <select value={values.family} onChange={handleChange('family')} className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.family ? 'border-red-300' : 'border-dark-200'}`}>
            <option value="">Select family</option>
            {families.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          {errors.family && <p className="mt-1 text-xs font-medium text-red-500">{errors.family}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Color</label>
          <input value={values.color} onChange={handleChange('color')} placeholder="e.g. Scarlet" className={`w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 ${errors.color ? 'border-red-300' : 'border-dark-200'}`} />
          {errors.color && <p className="mt-1 text-xs font-medium text-red-500">{errors.color}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-dark-500">Hex Code</label>
          <input value={values.hexCode} onChange={handleChange('hexCode')} placeholder="#FF2400" className="w-full rounded-lg border px-3.5 h-10 text-sm text-dark-900 border-dark-200" />
        </div>
      </form>
    </Modal>
  );
}

import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Modal from "../../../../../components/tableComponents/Modal";
import Button from "../../../../../components/tableComponents/Button";
import type { Category, CategoryFormValues, ModalMode } from "./types";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";

interface CategoryFormModalProps {
  isOpen: boolean;
  mode: ModalMode;
  initialData?: Category | null;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
}

const EMPTY_FORM: CategoryFormValues = {
  categoryName: "",
  image: null,
  categoryHead: "",
  fatherName: "",
  cast: "",
  contact: "",
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
  const { postQuery } = usePostQuery();

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialData) {
      const { categoryName, image, categoryHead, fatherName, cast, contact } =
        initialData;

      setValues({
        categoryName,
        image: image ?? null,
        categoryHead,
        fatherName,
        cast,
        contact,
      });
    } else {
      setValues(EMPTY_FORM);
    }

    setErrors({});
  }, [isOpen, mode, initialData]);

  const handleChange =
    (field: keyof CategoryFormValues) => (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await postQuery({
      url: apiUrls.Image.upload,
      postData: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onSuccess: (res: any) => {
        setValues((prev) => ({
          ...prev,
          image: res.data,
        }));
      },
    });
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.categoryName.trim()) {
      nextErrors.categoryName = "Category name is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting image:", values.image);
    if (!validate()) return;

    onSubmit(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Category" : "Edit Category"}
      description={
        mode === "add"
          ? "Create a new category."
          : "Update the category details."
      }
      footer={
        <div className="flex justify-end gap-4 w-full">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>

          <Button className="bg-dark" type="submit" form="category-form">
            {mode === "add" ? "Add Category" : "Save Changes"}
          </Button>
        </div>
      }
    >
      <form
        id="category-form"
        onSubmit={handleSubmit}
        className="space-y-6 py-4"
      >
        {/* Category Name */}
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            Category Name
          </label>

          <input
            type="text"
            value={values.categoryName}
            onChange={handleChange("categoryName")}
            placeholder="Enter category name"
            className={`w-full h-12 rounded-md border px-4 text-sm outline-none transition
            ${
              errors.categoryName
                ? "border-red-500"
                : "border-border focus:border-primary"
            }`}
          />

          {errors.categoryName && (
            <p className="mt-1 text-xs text-red-500">{errors.categoryName}</p>
          )}
        </div>

        {/* Category Image */}
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            Category Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full rounded-md border border-border p-2"
          />
          {values.image && (
            <img
              src={values.image as string}
              className="h-28 w-28 rounded-lg object-cover border"
            />
          )}
        </div>
      </form>
    </Modal>
  );
}

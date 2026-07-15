import { CheckCircle2, Package, Tag } from "lucide-react";
import { Modal } from "antd";
import Button from "../../masterData/Category/component/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onLink: () => void;
  product?: {
    image: string;
    title: string;
    sku: string;
    category?: string;
    subCategory?: string;
  };
};

const ProductAddedModal = ({ open, onClose, onLink, product }: Props) => {
  return (
    <Modal
      open={open}
      footer={null}
      centered
      width={560}
      closable={false}
      onCancel={onClose}
    >
      <div className="py-4">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold">
          Product Added Successfully
        </h2>

        <p className="mt-2 text-center text-muted">
          Your product has been created successfully.
        </p>

        {product && (
          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <div className="flex gap-5">
              <img
                src={product.image}
                className="h-28 w-28 rounded-xl object-cover border"
              />

              <div className="flex flex-1 flex-col justify-center">
                <h3 className="text-lg font-semibold">{product.title}</h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <Tag className="h-4 w-4" />
                  SKU:
                  <span className="font-semibold text-body">{product.sku}</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <Package className="h-4 w-4" />
                  {product.category}
                  {product.subCategory && ` • ${product.subCategory}`}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Done
          </Button>

          <Button type="button" variant="primary" onClick={onLink}>
            Link Another Product
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductAddedModal;

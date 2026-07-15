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
    brand?: string;
    color?: string;
    sizeType?: string;
    variantCount?: number;
    minPrice?: number;
    maxPrice?: number;
  };
};

import {
  CheckCircle2,
  Package,
  Tag,
  Palette,
  Shapes,
  Shirt,
  IndianRupee,
} from "lucide-react";
import { Modal } from "antd";
import Button from "../../masterData/Category/component/Button";

const ProductAddedModal = ({ open, onClose, onLink, product }: Props) => {
  return (
    <Modal
      open={open}
      footer={null}
      centered
      width={700}
      closable={false}
      onCancel={onClose}
    >
      <div className="px-2 py-6">
        {/* Success */}
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Product Added Successfully
          </h2>

          <p className="mt-2 text-gray-500">
            Your product has been created and is now available in inventory.
          </p>
        </div>

        {product && (
          <div className="mt-10 rounded-2xl border bg-white shadow-sm">
            <div className="flex gap-6 p-6">
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.title}
                className="h-40 w-40 rounded-xl border object-cover"
              />

              {/* Product Info */}
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">{product.title}</h3>

                    <span className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                      SKU: {product.sku}
                    </span>
                  </div>

                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    Live
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    <span className="text-gray-500">Category</span>
                  </div>

                  <div className="font-medium">{product.category}</div>

                  <div className="flex items-center gap-2">
                    <Shapes size={16} />
                    <span className="text-gray-500">Sub Category</span>
                  </div>

                  <div className="font-medium">
                    {product.subCategory || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}

        <div className="mt-8 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Done
          </Button>

          <Button type="button" variant="primary" onClick={onLink}>
            Link Similar Products
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductAddedModal;

import { useEffect, useMemo, useState } from "react";
import { FaGift } from "react-icons/fa6";
import { Search } from "lucide-react";
import axios from "axios";

import type { GiftItem, GiftProduct } from "../../types";

import GiftSearchCard from "./GiftSearchCard";
import GiftCard from "./GiftCard";
import { apiBaseUrl } from "@/apis";

type Props = {
  gifts: GiftItem[];
  setGifts: (gifts: GiftItem[]) => void;
};

const GiftSection = ({ gifts, setGifts }: Props) => {
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<GiftProduct[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${apiBaseUrl}${apiBaseUrl.endsWith("/") ? "" : "/"}product/home`,
          {
            params: {
              search: query,
            },
          },
        );

        setProducts(res.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const selectedIds = useMemo(() => gifts.map((g) => g.product), [gifts]);

  const addGift = (product: GiftProduct) => {
    if (selectedIds.includes(product._id)) return;

    setGifts([
      ...gifts,
      {
        product: product._id,

        quantity: 1,

        size: product.price[0]?.size._id || "",

        productDetails: {
          title: product.title,

          image: product.image,

          brand: product.brand?.brand || "",

          sku: product.price[0]?.skuCode,

          sizes: product.price.map((p) => ({
            label: p.size.size,
            value: p.size._id,
          })),
        },
      },
    ]);
  };

  const removeGift = (productId: string) => {
    setGifts(gifts.filter((x) => x.product !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setGifts(
      gifts.map((gift) =>
        gift.product === productId
          ? {
              ...gift,
              quantity,
            }
          : gift,
      ),
    );
  };

  const updateSize = (productId: string, size: string) => {
    setGifts(
      gifts.map((gift) =>
        gift.product === productId
          ? {
              ...gift,
              size,
            }
          : gift,
      ),
    );
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
        <FaGift className="text-primary text-xl" />

        <div>
          <h3 className="text-lg font-semibold">Free Gifts</h3>

          <p className="text-sm text-muted-foreground">
            Optional products that will be sent free with this product.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gift products..."
          className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 outline-none focus:border-primary"
        />
      </div>

      {loading && (
        <div className="mt-4 text-sm text-muted-foreground">Searching...</div>
      )}

      {!loading && products.length > 0 && (
        <div className="mt-5 space-y-3">
          {products.map((product) => (
            <GiftSearchCard
              key={product._id}
              product={product}
              disabled={selectedIds.includes(product._id)}
              onAdd={() => addGift(product)}
            />
          ))}
        </div>
      )}

      {gifts.length > 0 && (
        <div className="mt-8">
          <h4 className="mb-4 text-base font-semibold">Selected Gifts</h4>

          <div className="space-y-4">
            {gifts.map((gift) => (
              <GiftCard
                key={gift.product}
                gift={gift}
                onDelete={() => removeGift(gift.product)}
                onQuantityChange={(qty) => updateQuantity(gift.product, qty)}
                onSizeChange={(size) => updateSize(gift.product, size)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default GiftSection;

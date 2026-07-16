import { jacket, shirts } from "../../../../assets/assets";
import Heading from "../../../../components/Common/Heading";
import ProductCard from "./ProductCard";

let products = [
  {
    name: "Oxford Linen Shirt",
    cat: "Shirts",
    price: "₹290",
    img: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=700&q=80&fit=crop",
  },
  { name: "Slim Poplin Shirt", cat: "Shirts", price: "₹240", img: shirts },
  {
    name: "Chambray Relaxed",
    cat: "Shirts",
    price: "₹265",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=80&fit=crop",
  },
  { name: "Slim Poplin Jacket", cat: "Shirts", price: "₹240", img: jacket },
  {
    name: "Bifold Leather",
    cat: "Accessories",
    price: "₹220",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80&fit=crop",
  },
  {
    name: "Travel Cardholder",
    cat: "Accessories",
    price: "₹195",
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80&fit=crop",
  },
  {
    name: "The Minimalist",
    cat: "Accessories",
    price: "₹160",
    img: "https://images.unsplash.com/photo-1559656914-a30970c1affd?w=700&q=80&fit=crop",
  },
];

const buttons = [
  "More Face Wash and Cleanser",
  "More Purple Face Wash and Cleanser",,
];

export default function CustomerLiked() {
  return (
    <section className="bg-surface py-16">
      <div className="px-5 sm:px-10 lg:px-20 ">
        <Heading
          value={{
            text: "Customer also liked",
            position: "start",
          }}
        />

        {/* Products grid */}
        <div className=" mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p: any) => (
            <ProductCard product={p} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-center text-muted text-sm py-10">
              No products in this category yet.
            </p>
          )}
        </div>

     
      </div>
    </section>
  );
}

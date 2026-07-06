import { useState } from "react";
import { catalogData } from "../../../../utils/data";
import ProductCard from "../../Product/component/ProductCard";

const GENDERS = ["All", "Men", "Women", "Kids"] as const;
type Gender = (typeof GENDERS)[number];

export default function ProductShowcase() {
  const [gender, setGender] = useState<Gender>("Men");
  const [subCat, setSubCat] = useState(catalogData.Men.subCats[0].title);

  const handleGender = (g: Gender) => {
    setGender(g);
    setSubCat(catalogData[g].subCats[0]?.title ?? "");
  };

  const subCats = catalogData[gender].subCats;
  const products = catalogData[gender].products[subCat] ?? [];

  return (
    <section className="bg-surface/50 py-10">
      <div className="px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto">
       

        {/* Gender tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-card rounded-full p-1 gap-0.5 border border-heading/10">
            {GENDERS.map((g) => (
              <button
                key={g}
                onClick={() => handleGender(g)}
                className={`text-[11px] font-medium tracking-[0.18em] uppercase px-5 py-2 rounded-full transition-all duration-200 flex items-center justify-center
                  ${
                    g === gender
                      ? "bg-dark text-gray-50 shadow-sm font-bold"
                      : "text-heading/90 hover:text-heading font-semibold"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-category pills */}
        <div className="flex gap-4 overflow-x-auto pb-1 mb-10 justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {subCats.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setSubCat(cat.title)}
              className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0"
            >
              <div
                className={`w-[52px] h-[52px] sm:w-[40px] sm:h-[40px] lg:w-[90px] lg:h-[90px] rounded-full flex items-center justify-center overflow-hidden border-1 transition-all duration-200 bg-card
                  ${cat.title === subCat ? "border-primary" : "border-transparent"}`}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-[95%] h-[95%] object-contain"
                  style={{ objectPosition: "top" }}
                />
              </div>
              <span
                className={`text-[10px] font-medium tracking-wider uppercase
                  ${cat.title === subCat ? "text-heading border-b-[1px] pb-1 px-2 border-body " : "text-heading/70"}`}
              >
                {cat.title}
              </span>
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p:any) => (
            <ProductCard product={p} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-center text-muted text-sm py-10">
              No products in this category yet.
            </p>
          )}
        </div>

        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-block border border-heading/30 text-heading px-8 sm:px-10 py-3 sm:py-3.5 text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-heading hover:text-white transition-all duration-400"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
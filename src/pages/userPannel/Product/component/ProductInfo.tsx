
import React, { use, useEffect, useState } from "react";
import { useReveal } from "../../../../hooks/gsap/useReveal";
import { kidsFootwear, shirts } from "../../../../assets/assets";
import RatingsAndReviews from "./RatingReviews";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import useGetQuery from "../../../../hooks/getQuery.hook";
import { apiBaseUrl, apiUrls } from "../../../../apis";

/* ---------------------------- Small building blocks ---------------------------- */

const StarRating = ({ rating, totalRatings }: any) => (
  <div className="flex items-center gap-1.5 mt-1">
    <div className="flex items-center gap-0.5">
      {Array(5)
        .fill("")
        .map((_, i) => (
          <svg key={i} width="12" height="11" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
              fill={rating > i ? "#835240" : "#e6d9cf"}
            />
          </svg>
        ))}
    </div>
    <span className="text-[12px] text-[#3b302a] font-medium">{rating}</span>
    <span className="w-px h-3 bg-[#e6d9cf]" />
    <span className="text-[12px] text-[#84746e]">{totalRatings} Reviews</span>
  </div>
);

const SectionLabel = ({ children, action }: any) => (
  <div className="flex items-center justify-between mb-2">
    <p className="text-[11px] tracking-[0.14em] uppercase text-[#3b302a] font-medium">{children}</p>
    {action}
  </div>
);

const TrustLine = ({ icon, children }: any) => (
  <div className="flex items-center gap-2 text-[12.5px] text-[#51443f] py-1">
    {icon}
    <span>{children}</span>
  </div>
);

const SpecCell = ({ label, value }: any) => (
  <div>
    <p className="text-[11px] text-[#a89a90]">{label}</p>
    <p className="text-[13px] text-[#3b302a] mt-0.5">{value}</p>
  </div>
);

const TruckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M2 7h13v9H2z" stroke="#835240" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M15 10h4l3 3v3h-7v-6z" stroke="#835240" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="6.5" cy="18" r="1.8" stroke="#835240" strokeWidth="1.5" />
    <circle cx="17.5" cy="18" r="1.8" stroke="#835240" strokeWidth="1.5" />
  </svg>
);

const ReturnIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M4 4v6h6" stroke="#835240" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 14a8 8 0 1 0 2-8.5L4 10" stroke="#835240" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 5v6c0 5 3.4 8.7 8 9.9C16.6 19.7 20 16 20 11V5l-8-3z" stroke="#835240" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const HeartIcon = ({ filled }: any) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 20.5s-7.5-4.6-9.8-9.2C.6 7.8 2.3 4 6 4c2.1 0 3.6 1.1 4.5 2.4C11.4 5.1 12.9 4 15 4c3.7 0 5.4 3.8 3.8 7.3-2.3 4.6-9.8 9.2-9.8 9.2z"
      stroke="#835240"
      strokeWidth="1.6"
      fill={filled ? "#835240" : "none"}
    />
  </svg>
);

/* ---------------------------------- Main ---------------------------------- */

const ProductInfo = () => {
  const [productData, setProductData] = useState<{}>()
  const [isLoading, setIsLoading] = useState(true)
  let { id } = useParams()
  const { getQuery } = useGetQuery()
  const navigate = useNavigate()
  useEffect(() => {
    setIsLoading(true)
    getQuery({
      url: apiUrls.Product.getById + id,
      onSuccess: (res: any) => {
        console.log(res.data, "====");
        // Properly create subImages array with main image at the beginning
        const subImages = res?.data?.image ? [res.data.image, ...(res?.data?.subImages || [])] : (res?.data?.subImages || [])
        setProductData({ ...res.data, subImages })
        setIsLoading(false)
      },
      onFail: (res: any) => {
        console.log(res);
        setIsLoading(false)
      },
    })
  }, [id])



  console.log(id, "9999999999")
  const product = {
    brand: "Campus",
    name: "HIGHBIRD Women Colourblocked Sneakers",
    category: "Footwear",
    subCategory: "Sneakers",
    mrp: 2999,
    sellingPrice: 1659,
    discount: 45,
    rating: 4.6,
    totalRatings: 480,
    images: [kidsFootwear, kidsFootwear, kidsFootwear, kidsFootwear],
    colorOptions: [
      { name: "Grey", image: kidsFootwear },
      { name: "Lavender", image: kidsFootwear },
      { name: "White", image: kidsFootwear },
    ],
    availableSizes: [
      { size: "4", stock: true },
      { size: "5", stock: true },
      { size: "6", stock: true },
      { size: "7", stock: true },
      { size: "8", stock: true },
    ],
    description: [
      "Colourblocked premium sneakers for women.",
      "Breathable mesh upper with synthetic overlays.",
    ],
    specs: [
      { label: "Material", value: "Mesh & synthetic upper" },
      { label: "Sole", value: "EVA cushioned sole" },
      { label: "Closure", value: "Lace-up" },
      { label: "Fit", value: "True to size" },
    ],
    inStock: true,

    totalReviews: 128,

    ratingDistribution: {
      5: 312,
      4: 103,
      3: 38,
      2: 16,
      1: 11,
    },

    reviews: [
      {
        id: 1,
        name: "Rahul Sharma",
        rating: 5,
        verified: true,
        date: "2 weeks ago",
        title: "Excellent Quality",
        review:
          "Very comfortable shoes. Material feels premium, lightweight and perfect for everyday wear.",
        helpful: 122,
        images: [
          kidsFootwear,
          kidsFootwear,
        ],
      },
      {
        id: 2,
        name: "Priya Singh",
        rating: 5,
        verified: true,
        date: "1 month ago",
        title: "Loved It",
        review:
          "Beautiful design, excellent cushioning and true to size. Definitely worth buying.",
        helpful: 73,
        images: [
          kidsFootwear,
          kidsFootwear,
          kidsFootwear,
        ],
      },
    ],

  };

  const [thumbnail, setThumbnail] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState(product.colorOptions[0].name);
  // const [selectedSize, setSelectedSize] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(0);
  const [quantity, setQuantity] = React.useState(1);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const ref = useReveal();

  // Reset states when product data changes
  useEffect(() => {
    setThumbnail(0);
    setSelectedSize(0);
    setIsWishlisted(false);
  }, [productData]);

  const amountSaved = product.mrp - product.sellingPrice;

  if (isLoading) {
    return (
      <section className="bg-[#fdf9f3] py-5">
        <div className="px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#835240]"></div>
              <p className="mt-4 text-[#84746e]">Loading product...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    product && productData && (
      <section className="bg-[#fdf9f3] py-5">
        <div className="px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto">
          <div className="max-w-6xl w-full ">
            {/* Breadcrumb */}
            <p className="text-[10.5px] tracking-[0.08em] uppercase text-[#84746e]">
              <span>Home</span> /<span> Products</span> /
              <span> {product.category}</span> /
              <span className="text-[#835240]"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-10 mt-4">
              {/* ---------------------- LEFT SIDE — unchanged ---------------------- */}
              <div className="flex gap-3 sticky top-24 self-start">
                <div className="flex flex-col gap-2.5">

                  {productData?.subImages?.map((image: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => setThumbnail(index)}
                      className="border max-w-[70px] border-gray-500/30 rounded overflow-hidden cursor-pointer"
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>

                <div className="w-[420px] h-[520px] border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <img src={productData?.subImages?.[thumbnail]} alt="Selected product" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* ---------------------- RIGHT SIDE — Myntra-style compact layout ---------------------- */}
              <div className="w-full md:w-1/2">
                {/* Brand + Title */}
                <p className="text-[11px] tracking-[0.18em] uppercase text-[#b76e79] font-medium">
                  {productData?.brand}
                </p>
                <h1
                  className="mt-0.5 text-[22px] leading-[1.25] text-[#3b302a] font-heading font-semibold"
                // style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {productData?.title}
                </h1>

                <StarRating rating={productData?.rating} totalRatings={product.totalRatings} />

                {/* Price — single tight row, Myntra-style */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-[22px] text-[#3b302a] font-semibold leading-none">
                    ₹{productData?.price[selectedSize]?.amount}
                  </span>
                  <span className="text-[13px] text-[#84746e] line-through">
                    MRP ₹{productData?.price[selectedSize]?.markupPrice}
                  </span>
                  <span className="text-[13px] text-[#835240] font-medium">
                    ({Math.round((productData?.price[selectedSize]?.discount * 100) / (productData?.price[selectedSize]?.markupPrice || 1)) || 0}% OFF)
                  </span>
                </div>
                {productData?.price[selectedSize]?.discount != 0 &&
                  <p className="mt-0.5 text-[11px] text-[#84746e]">
                    inclusive of all taxes · you save ₹{productData?.price[selectedSize]?.discount}
                  </p>
                }


                {/* Size */}
                <div className="mt-4">
                  <SectionLabel
                    action={
                      <button
                        type="button"
                        className="text-[10.5px] text-[#b76e79] underline underline-offset-2 decoration-[#e6d9cf] hover:decoration-[#b76e79]"
                      >
                        Size Chart &gt;
                      </button>
                    }
                  >
                    Select Size
                  </SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {productData?.price.map((size: any, index: any) => (
                      <button
                        key={size}
                        type="button"
                        disabled={!size.isAvailable}
                        onClick={() => setSelectedSize(index)}
                        className={`w-9 h-9 rounded-full border text-[12.5px] transition-colors duration-200 ${!size.isAvailable
                          ? "border-[#e6d9cf] text-[#c9bfb6] cursor-not-allowed line-through"
                          : selectedSize === index
                            ? "bg-[#835240] border-[#835240] text-[#fdf9f3]"
                            : "border-[#e6d9cf] text-[#3b302a] hover:border-[#835240] hover:text-[#835240]"
                          }`}
                      >
                        {size.size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colour */}
                <div className="mt-4">
                  <SectionLabel>
                    Colour — <span className="text-[#84746e] normal-case tracking-normal">{productData?.color}</span>
                  </SectionLabel>
                  <div className="flex items-center gap-2">
                    {productData?.linkItems?.map((item: any) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => navigate({ pathname: `/productDeatils/${item?._id}` })}
                        aria-label={item?.name}
                        className={`relative w-8 h-8 rounded-full overflow-hidden border transition-all duration-200 ${selectedColor === item?._id
                          ? "border-[#835240] ring-1 ring-[#c98f7a] ring-offset-1 ring-offset-[#fdf9f3]"
                          : "border-[#e6d9cf]"
                          }`}
                      >
                        <img src={item?.image} alt={item._id} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTAs — tight, Myntra-style block buttons */}
                <div className="mt-4 flex items-center gap-2">
                  {/* <div className="flex items-center border border-[#e6d9cf] rounded-sm overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-11 flex items-center justify-center text-[#835240] hover:bg-[#f2e8dd]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-[13px] text-[#3b302a]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-11 flex items-center justify-center text-[#835240] hover:bg-[#f2e8dd]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div> */}

                  <button
                    type="button"
                    className="flex-1 h-11 text-[12px] tracking-[0.08em] uppercase font-medium bg-[#835240] text-[#fdf9f3] rounded-sm hover:bg-[#51291a] transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className="flex-1 h-11 text-[12px] tracking-[0.08em] uppercase font-medium border border-[#835240] text-[#835240] rounded-sm hover:bg-[#835240] hover:text-[#fdf9f3] transition-colors duration-200"
                  >
                    Buy Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWishlisted((w) => !w)}
                    aria-label="Add to wishlist"
                    className="w-11 h-11 flex items-center justify-center shrink-0 border border-[#e6d9cf] rounded-sm hover:border-[#835240] transition-colors duration-200"
                  >
                    <HeartIcon filled={isWishlisted} />
                  </button>
                </div>

                {/* Trust lines — plain stacked, no boxes, Myntra-style */}
                <div className="mt-4 pt-3 border-t border-[#e6d9cf]">
                  <TrustLine icon={<ShieldIcon />}>100% Original Products</TrustLine>
                  <TrustLine icon={<TruckIcon />}>Free shipping, pan-India</TrustLine>
                  <TrustLine icon={<ReturnIcon />}>Easy 7-day returns & exchanges</TrustLine>
                </div>

                {/* Product Details — static, no accordion, Myntra-style */}
                <div className="mt-4 pt-4 border-t border-[#e6d9cf]">
                  <p className="text-[11px] tracking-[0.14em] uppercase text-[#3b302a] font-medium mb-2">
                    Product Details
                  </p>
                  <p className="text-[13px] leading-[1.7] text-[#51443f]">
                    {productData?.description}
                  </p>

                  <p className="text-[11px] tracking-[0.14em] uppercase text-[#3b302a] font-bold mt-4 mb-2">
                    Specifications
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {productData?.attributes.map((spec: any) => (
                      <SpecCell key={spec._id} label={spec.property} value={spec.value} />
                    ))}
                  </div>
                </div>

                {/* Product code / seller */}
                <div className="mt-4 pt-3 border-t border-[#e6d9cf] text-[11.5px] text-[#84746e]">
                  Product Code: <span className="text-[#3b302a]">39052859</span>
                </div>
                <RatingsAndReviews
                  rating={product.rating}
                  totalRatings={product.totalRatings}
                  totalReviews={product.totalReviews}
                  ratingDistribution={product.ratingDistribution}
                  reviews={product.reviews}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default ProductInfo;
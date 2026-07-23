import { useState } from "react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Header/Navbar";
import { useReveal } from "../../../hooks/gsap/useReveal";
import ProductInfo from "./component/ProductInfo";
import SuggestedProduct from "./component/SuggestedProduct";

export default function ProductDetails() {
  const ref = useReveal<HTMLElement>();
  const [product, setProduct] = useState<any>(null);

  return (
    <>
      <Navbar />
      <ProductInfo onProductLoaded={setProduct} />
      <SuggestedProduct
        categoryId={product?.category?._id || product?.category}
        subCategoryId={product?.subCategory?._id || product?.subCategory}
        subCategoryName={product?.subCategory?.subCategory || product?.subCategory}
        currentProductId={product?._id}
      />
      {/* <CustomerLiked/> */}
      <Footer />
    </>
  );
}
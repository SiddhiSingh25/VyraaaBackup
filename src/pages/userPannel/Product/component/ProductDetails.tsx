import Footer from "../../../../components/Footer/Footer";
import Navbar from "../../../../components/Header/Navbar";
import { useReveal } from "../../../../hooks/gsap/useReveal";
import CustomerLiked from "./CustomerLiked";
import ProductInfo from "./ProductInfo";
import SuggestedProduct from "./SuggestedProduct";


export default function SignatureScent() {
  const ref = useReveal<HTMLElement>();

  return (
   <>
   <Navbar/>
   <ProductInfo/>
   <SuggestedProduct/>
   <CustomerLiked/>
   <Footer/>
   </>
  );
}
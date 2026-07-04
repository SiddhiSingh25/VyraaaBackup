import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Header/Navbar";
import { useReveal } from "../../../hooks/gsap/useReveal";
import CustomerLiked from "./component/CustomerLiked";
import ProductInfo from "./component/ProductInfo";
import SuggestedProduct from "./component/SuggestedProduct";



export default function ProductDetails() {
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
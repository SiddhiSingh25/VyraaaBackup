import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Header/Navbar";
import BrandStory from "./Components/BrandStory";
import FeaturedCollections from "./Components/FeaturedCollections";
import MarqueeBar from "./Components/Marquee";
import Newsletter from "./Components/Newsletter";
import ProductShowcase from "./Components/Productshowcase";
import HeroSlider from "./Components/Slider/Heroslider";
import Testimonials from "./Components/Testimonials";


export default function HomeScreen() {
  return (
    <div className="bg-background text-body font-body selection:bg-rose-gold selection:text-white">
      <Navbar/>
      <MarqueeBar/>
      {/* <HeroSlider/>
       */}
       <HeroSlider/>
      <ProductShowcase/>
      <FeaturedCollections/>
      <BrandStory/>
      <Testimonials/>
      <Newsletter/>
      <Footer/>
    </div>
  );
}
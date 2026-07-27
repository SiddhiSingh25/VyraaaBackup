import { useEffect, useState } from "react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Header/Navbar";
import BrandStory from "./Components/BrandStory";
import FeaturedCollections from "./Components/FeaturedCollections";
import MarqueeBar from "./Components/Marquee";
import Newsletter from "./Components/Newsletter";
import ProductShowcase from "./Components/Productshowcase";
import HeroSlider from "./Components/Slider/Heroslider";
import Testimonials from "./Components/Testimonials";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";


export default function HomeScreen() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { getQuery } = useGetQuery()

  const [category, setCategory] = useState([])

  const fetchCategory = () => {
    getQuery({
      url: `${apiUrls.Category.getAll}`,
      onSuccess: (catRes: any) => {
        const fetchedCategories = catRes.data || [];
        setCategory(fetchedCategories)
      },
      onFail(err: any) {
        console.error(err, "Error");
      }
    });
  }

  useEffect(() => {
    fetchCategory()
  }, [])


  return (
    <div className="bg-background text-body font-body selection:bg-rose-gold selection:text-white">
      <Navbar category={category} />
      <MarqueeBar />
      {/* <HeroSlider/>
       */}
      <HeroSlider />
      <ProductShowcase category={category} />
      <FeaturedCollections />
      <BrandStory />
      {/* <Testimonials/> */}
      <Newsletter />
      <Footer category={category} />
    </div>
  );
}
import { Outlet } from "react-router-dom";
import CheckoutStepper from "./CheckoutStepper";
import Navbar from "../../../components/Header/Navbar";
import Footer from "../../../components/Footer/Footer";

export default function CheckoutLayout() {
  return (
    <div>
      <Navbar/>
      <CheckoutStepper/>
      <div>
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
}
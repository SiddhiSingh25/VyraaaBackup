import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wrap each auth page's outermost element to get a subtle fade + slide-up on mount.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Navbar/>
      {children}
      <Footer/>
    </motion.div>
  );
};

export default PageTransition;

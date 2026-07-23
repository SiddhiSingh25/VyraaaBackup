import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  backgroundImageUrl?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionText, 
  onAction,
  // Pass your image path here, e.g., "/image_d07161.jpg"
  backgroundImageUrl = "../../../assets/images/Empty/empty.png" 
}: EmptyStateProps) {
  return (
    <div 
      className="flex min-h-[90vh] w-full items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex w-full max-w-[400px] flex-col items-center justify-center gap-5 overflow-hidden rounded-[2.5rem] border shadow border-[#5a4332]/30 bg-[#fdf8f5]/40 px-6 py-14 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-[#fdf8f5]/50 sm:gap-6 sm:px-10 sm:py-16"
      >
        {/* Ambient warm glow behind icon for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-12 h-32 w-32 -translate-x-1/2 rounded-full bg-[#e6baa3]/30 blur-3xl sm:h-40 sm:w-40"
        />

        {/* Icon Container */}
        <motion.div
          variants={itemVariants}
          animate={{ y: [0, -4, 0] }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          whileHover={{ scale: 1.05 }}
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#fcf5ef] text-[#4a3728] shadow-sm ring-1 ring-[#5a4332]/10 sm:h-20 sm:w-20"
        >
          {/* Subtle inner orbital rings for polish */}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#5a4332]/5" />
          <motion.div 
            className="absolute h-24 w-24 rounded-full border border-[#5a4332]/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div className="z-10 text-2xl text-red-700 sm:text-3xl [&>svg]:h-7 [&>svg]:w-7 sm:[&>svg]:h-9 sm:[&>svg]:w-9">
            {icon}
          </div>
        </motion.div>

        {/* Typography */}
        <motion.div variants={itemVariants} className="relative z-10 space-y-3 sm:space-y-4">
          <h3 className="font-serif text-2xl font-medium tracking-tight text-[#3b2d24] sm:text-3xl">
            {title}
          </h3>
          <p className="mx-auto max-w-[280px] text-sm leading-relaxed text-[#68574c] sm:max-w-[320px] sm:text-base">
            {description}
          </p>
        </motion.div>

        {/* Action Button */}
        {actionText && onAction && (
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={onAction}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative z-10 mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#4e382c] px-8 py-3.5 text-sm font-medium tracking-wide text-[#fdf8f5] shadow-md transition-colors duration-200 hover:bg-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#4e382c] focus:ring-offset-2 focus:ring-offset-[#fdf8f5] sm:mt-5 sm:text-base"
          >
            {actionText}
            {/* Arrow Icon embedded for "Continue Shopping ->" look */}
            <svg 
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
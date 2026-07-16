import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Eye, Star } from "lucide-react";
import { C } from "../constants";
import { money, pct } from "../utils";
import Badge from "./Badge";
import type { Product } from "../types";
import { useNavigate } from "react-router-dom";

export interface ProductCardProps {
  product: Product;
  // wished: boolean;
  // onToggleWish: (id: string) => void;
}

export default function ProductCard({
  product,
  // wished,
  // onToggleWish,
}: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const discount = pct(product.price, product.mrp);
  const navigate = useNavigate();
  return (
    <motion.div
      className="group flex flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}

      onClick={() => navigate({ pathname: `/productDeatils/${product?.id}` })
      }
    >
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ aspectRatio: "4 / 5", background: C.card }}
      >
        <img
          src={hover ? product.img2 : product.img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[400ms] ease-out"
          style={{ transform: hover ? "scale(1.045)" : "scale(1)" }}
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <Badge
              key={b}
              tone={
                b === "Premium"
                  ? "rose"
                  : b === "Limited Stock" || b === "Only Few Left"
                    ? "warn"
                    : "dark"
              }
            >
              {b}
            </Badge>
          ))}
        </div>

        <button
          // onClick={() => onToggleWish(product.id)}
          aria-label="Wishlist"
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(253,249,243,0.9)" }}
        >
          <Heart
            size={16}
            strokeWidth={1.8}
          // fill={wished ? C.rose : "none"}
          // color={wished ? C.rose : C.heading}
          />
        </button>

        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2.5 left-2.5 right-2.5 hidden md:flex gap-2"
            >
              <button
                className="flex-1 h-10 rounded-full text-[12px] font-medium flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                style={{ background: C.dark, color: "#fff" }}
              >
                <Plus size={13} /> Quick Add
              </button>
              <button
                aria-label="Quick view"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(253,249,243,0.95)",
                  color: C.heading,
                }}
              >
                <Eye size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-3 flex flex-col gap-1">
        <span
          className="text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: C.muted }}
        >
          {product.brand}
        </span>
        <span
          className="text-[13.5px] leading-snug line-clamp-1"
          style={{ color: C.heading, fontFamily: "'Playfair Display', serif" }}
        >
          {product.name}
        </span>
        <div
          className="flex items-center gap-1.5 text-[11.5px]"
          style={{ color: C.muted }}
        >
          <span
            className="flex items-center gap-0.5"
            style={{ color: C.heading }}
          >
            <Star size={11} fill={C.warning} color={C.warning} />
            {product.rating}
          </span>
          <span>({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <span
            className="text-[15px] font-semibold"
            style={{ color: C.heading }}
          >
            {money(product.price)}
          </span>
          <span className="text-[12px] line-through" style={{ color: C.muted }}>
            {money(product.mrp)}
          </span>
          <span
            className="text-[12px] font-medium"
            style={{ color: C.success }}
          >
            {discount}% off
          </span>
        </div>
        {/* <span className="text-[11px]" style={{ color: C.muted }}>
          Delivery by {product.delivery}
        </span> */}
      </div>
    </motion.div >
  );
}

import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }: any) => {
  return (
    <Link to="/productDeatils">
    <div className="group transition-all duration-500 ease-out hover:-translate-y-1">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl mb-4 sm:mb-6 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] group-hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)] transition-shadow duration-500">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />

        {/* Soft ivory scrim reveal */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="bg-[#FAF6F0]/95 backdrop-blur-sm border-t border-[#D4B896]/40">
            <button className="w-full py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-medium tracking-[0.28em] uppercase text-heading hover:text-[#B08D57] transition-colors duration-300">
              Discover
            </button>
          </div>
        </div>
      </div>

      <div className="px-0.5 sm:px-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-px bg-[#B08D57]" />
          <p className="text-[9px] sm:text-[10px] font-medium tracking-[0.32em] uppercase text-[#B08D57]">
            {product.cat}
          </p>
        </div>

        <h4 className="font-heading text-heading text-lg sm:text-xl font-normal leading-snug tracking-[0.01em] line-clamp-2">
          {product.name}
        </h4>

        <p className="text-sm sm:text-[15px] tracking-[0.03em] text-heading mt-2">
          {product.price}
        </p>
      </div>
    </div>
    </Link>
  )
}

export default ProductCard
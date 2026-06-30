interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const LINKS = ["Clothing", "Perfumes", "Jewelry", "Bags", "Editorial", "Atelier"];

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div
      role="dialog"
      aria-label="Navigation menu"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-[200] flex-col items-center justify-center bg-background/98 backdrop-blur-2xl
        ${open ? "flex" : "hidden"}`}
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="absolute top-5 right-6 text-heading text-2xl"
      >
        <span className="material-symbols-outlined text-[28px]">close</span>
      </button>

      {LINKS.map((label) => (
        <a
          key={label}
          href="#"
          onClick={onClose}
          className="font-heading font-light text-heading w-[70%] text-center border-b border-border py-3.5
            text-[clamp(28px,6vw,40px)] tracking-[0.1em] last-of-type:border-none hover:text-primary transition-colors"
        >
          {label}
        </a>
      ))}

      <div className="flex items-center gap-6 mt-8">
        <button className="material-symbols-outlined text-heading text-[24px]">search</button>
        <button className="material-symbols-outlined text-heading text-[24px]">favorite</button>
        <button className="material-symbols-outlined text-heading text-[24px]">shopping_bag</button>
      </div>
    </div>
  );
}
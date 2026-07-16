import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../../components/Header/Navbar";
import Footer from "../../../components/Footer/Footer";
import WishlistCard from "./components/WishlistCard";
import type { WishlistProduct } from "./components/types";
import { RECOMMENDED } from "./components/data"; // Removed INITIAL_WISHLIST as we fetch from API
import RecommendedCard from "./components/RecomendationCard";
import useGetQuery from "../../../hooks/getQuery.hook";
import { apiUrls } from "../../../apis";

function EmptyWishlist() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-surface py-24 text-center"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1.5">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
      <div>
        <p className="font-heading text-lg text-admin-text">Your wishlist is empty</p>
        <p className="mt-1 text-sm text-muted">Save pieces you love and find them here anytime.</p>
      </div>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-2 rounded-full bg-heading px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-primary-dark"
      >
        Continue Shopping
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                              */
/* ------------------------------------------------------------------ */

export default function WishlistPage() {
  const { getQuery } = useGetQuery();
  const navigate = useNavigate();

  // 1. Add loading state and initialize items as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<WishlistProduct[]>([]);

  useEffect(() => {
    getQuery({
      url: apiUrls.WishList.getByUserId,
      onSuccess: (res: any) => {

        const fetchedItems = res.data.items.map((item: any) => {


          const defaultPrice = (item.product.price && item.product.price.length > 0)
            ? item.product.price[0]
            : { amount: 0, markupPrice: null, isAvailable: true };

          return {
            id: item.product._id,
            brand: item.product.brand || "Vyraa",
            name: item.product.title,
            image: item.product.image,
            rating: item.product.rating || 0,


            price: defaultPrice.amount,
            originalPrice: defaultPrice.markupPrice,
            stockStatus: defaultPrice.isAvailable ? "in-stock" : "out-of-stock",


            colorName: "Standard",
            colorHex: "#000000",
            size: "Standard",
            reviewCount: 0,
            badge: null,
          };
        });

        setItems(fetchedItems);
        setIsLoading(false); // Stop loading on success
      },
      onFail: (res: any) => {
        console.error("Failed to fetch wishlist:", res);
        setIsLoading(false); // Stop loading on failure so UI doesn't hang
      },
    });
  }, []); // Run once on mount

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const addToBag = (id: string) => {
    // hook up to your cart logic
    console.log("Add to bag:", id);
  };

  const buyNow = (id: string) => {
    // hook up to your checkout flow
    navigate(`/checkout?product=${id}`);
  };

  const notifyMe = (id: string) => {
    console.log("Notify me:", id);
  };

  const moveAllToBag = () => {
    items
      .filter((item) => item.stockStatus !== "out-of-stock")
      .forEach((item) => addToBag(item.id));
  };

  // 3. Render a loading skeleton or spinner while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto flex max-w-7xl items-center justify-center px-5 pb-24 pt-32 sm:px-8 lg:px-10">
          <p className="text-lg font-medium text-muted">Loading your wishlist...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-24 pt-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl text-admin-text sm:text-4xl">
              My Wishlist{" "}
              <span className="align-middle text-lg font-normal text-muted">
                ({items.length})
              </span>
            </h1>
            <p className="mt-2 text-sm text-body">Pieces you love, saved for later.</p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm text-body transition-colors hover:text-primary"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.6 10.5 15.4 6.5M8.6 13.5l6.8 4" />
                </svg>
                Share
              </button>
              <button
                type="button"
                onClick={moveAllToBag}
                className="flex items-center gap-1.5 rounded-full bg-heading px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary-dark"
              >
                Move All to Bag
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="pt-10">
            <EmptyWishlist />
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {items.map((product) => (
                  <WishlistCard
                    key={product.id}
                    product={product}
                    onRemove={removeItem}
                    onAddToBag={addToBag}
                    onBuyNow={buyNow}
                    onNotifyMe={notifyMe}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              Don't let your favorites go — move items to your bag before they're gone.
            </p>
          </>
        )}

        {/* You May Also Like */}
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-heading text-2xl text-admin-text">You May Also Like</h2>
            <span className="hidden text-sm text-muted sm:block">Curated to match your taste</span>
          </div>

          <div className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {RECOMMENDED.map((product) => (
              <RecommendedCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
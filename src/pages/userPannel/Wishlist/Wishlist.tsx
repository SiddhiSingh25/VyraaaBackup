import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../../components/Header/Navbar";
import Footer from "../../../components/Footer/Footer";
import WishlistCard from "./components/WishlistCard";
import useGetQuery from "../../../hooks/getQuery.hook";
import usePostQuery from "../../../hooks/postQuery.hook";
import { useToast } from "../../../hooks/useToast.hook";
import { apiUrls } from "../../../apis";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeFromWishlist, setWishlist } from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { FiHeart } from "react-icons/fi";
import { EmptyState } from "@/components/Common/EmptyList/EmptyList";
import PageLoader from "@/components/Loader/fullPageLoader";



/* ------------------------------------------------------------------ */
/* Page                                                              */
/* ------------------------------------------------------------------ */

export default function WishlistPage() {
  const { getQuery, loading } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const items = useAppSelector((state: any) => state.wishlist.items || []);

  useEffect(() => {
    window.scrollTo(0, 0)
    getQuery({
      url: apiUrls.WishList.getByUserId,
      onSuccess: (res: any) => {
        const validItems = res.data.items.filter((item: any) => {
          if (!item.product) {
            console.warn("Wishlist item has a deleted/missing product, skipping:", item._id);
            return false;
          }
          return true;
        });

        const fetchedItems = validItems.map((item: any) => {
          const priceEntry =
            item.product.price && item.product.price.length > 0
              ? item.product.price[0]
              : { amount: 0, markupPrice: null, isAvailable: true, isFewLeft: false, discount: 0, skuCode: "" };

          return {
            id: item.product._id,
            wishlistItemId: item._id, // useful if you ever need to remove by wishlist entry, not product id
            brand: item.product.brand || "Vyraa",
            name: item.product.title,
            image: item.product.image,
            rating: item.product.rating || 0,

            price: priceEntry.amount,
            originalPrice: priceEntry.markupPrice,
            discount: priceEntry.discount || 0,
            skuCode: priceEntry.skuCode || "",

            stockStatus: priceEntry.isAvailable ? "in-stock" : "out-of-stock",
            isFewLeft: !!priceEntry.isFewLeft,

            sizeId: priceEntry._id || "",
            size: priceEntry.size?.size || "Standard",

            colorName: "Standard",
            colorHex: "#000000",
            reviewCount: 0,
            badge: priceEntry.isFewLeft ? "Few Left" : priceEntry.discount ? `${priceEntry.discount}% OFF` : null,

            addedAt: item.addedAt,
          };
        });

        dispatch(setWishlist(fetchedItems));
        setIsLoading(false); // Stop loading on success
      },
      onFail: (res: any) => {
        console.error("Failed to fetch wishlist:", res);
        setIsLoading(false); // Stop loading on failure so UI doesn't hang
      },
    });
  }, [dispatch]); // Run once on mount

  const removeItem = (id: string) => {

    dispatch(removeFromWishlist(id));
    toast("success", "Removed from wishlist successfully");

    getQuery({
      url: apiUrls.WishList.remove + id,
      onSuccess: (res: any) => { },
      onFail: (res: any) => {
        console.error("Failed to remove from wishlist:", res);
      },
    });
  };

  const addToBag = (id: string) => {
    const product = items.find((item: any) => item.id === id);
    if (!product) return;

    postQuery({
      url: apiUrls.Cart.add,
      postData: {
        productId: product.id,
        size: product.sizeId || "",
        quantity: 1,
      },
      onSuccess: (res: any) => {
        toast("success", res.message || "Added to cart successfully");
        dispatch(
          addToCart({
            id: product.id,
            brand: product.brand,
            name: product.name,
            image: product.image,
            quantity: 1,
            qty: 1,
            size: product.size || "Standard",
            price: product.price,
            mrp: product.originalPrice || product.price,
          })
        );
        getQuery({
          url: apiUrls.WishList.remove + id,
          onSuccess: () => {
            dispatch(removeFromWishlist(id));
          },
          onFail: (err: any) => {
            console.error("Failed to delete wishlist item on addToBag:", err);
          }
        });
      },
      onFail: (res: any) => {
        console.error("Failed to add to cart:", res);
        toast("error", res?.data?.message || "Failed to add to cart");
      },
    });
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
      .filter((item: any) => item.stockStatus !== "out-of-stock")
      .forEach((item: any) => addToBag(item.id));
  };

  // 3. Render a loading skeleton or spinner while fetching
  if (loading) {
    return (
      <PageLoader loading={loading} text="Loading Wishlist..." />
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


        </div>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="pt-10">
            <EmptyState
              icon={<FiHeart size={28} className="text-dark/50" />}
              title="Your wishlist is empty"
              description="Save pieces you love and find them here anytime."
              actionText="Continue Shopping"
              onAction={() => navigate("/products")}
            />
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {items.map((product: any) => (
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

      </main>

      <Footer />
    </div>
  );
}
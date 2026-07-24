import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CartItem } from "./component/cart";
import { computePriceDetails } from "./component/pricing";
import CartListHeader from "./component/CartListHeader";
import CartItemCard from "./component/CartItemCard";
import OrderSummary from "./component/OrderSummary";
import TrustBadges from "./component/TrustBadges";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import { apiUrls } from "../../../../apis";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setCartItems,
  updateQuantity,
  removeFromCart,
} from "../../../../redux/slices/cartSlice";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";
import { EmptyState } from "@/components/Common/EmptyList/EmptyList";
import { FiShoppingBag } from "react-icons/fi";

const COUPON_DISCOUNT = 60;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    items,
    totalItems,
    cartTotalAmount,
    cartTotalMarkupPrice,
    cartTotalDiscount,
  } = useSelector((state: any) => state.cart);

  const [couponApplied, setCouponApplied] = useState(false);
  const [donation, setDonation] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const { getQuery } = useGetQuery();

  const [cartData, setCartData] = useState<any>();

  const refreshCart = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    window.scrollTo(0, 0)
    getQuery({
      url: apiUrls.Cart.getByUserId,
      onSuccess: (res: any) => {
        setCartData(res.data);

        if (res.data && res.data.items) {
          const mappedItems = res.data.items.map((apiItem: any) => {
            const product = apiItem.product || {};
            const priceList = product.price || [];

            const availableSizes = priceList
              .map((p: any) => p.size?.size || p.size)
              .filter(Boolean);

            // ==========================================
            // NEW: FIND EXACT SIZE DATA FOR THIS ITEM
            // ==========================================
            const currentSizeId = apiItem.size?._id || apiItem.size;
            const sizeData = priceList.find(
              (p: any) => String(p.size?._id || p.size) === String(currentSizeId)
            ) || priceList[0] || {};

            // Extract exact prices based on the matched size data
            const baseMrp = sizeData.markupPrice || apiItem.unitPrice || 0;
            const basePrice = sizeData.amount || apiItem.unitPrice || 0;
            const currentQty = apiItem.quantity || 1;

            return {
              ...apiItem,
              id: apiItem._id,
              cartItemId: apiItem._id,
              brand: product.brand?.brand || product.brand || product.manufacturer,
              name: product.title || "Product",
              soldBy: "VYRAAA",
              image: product.image || product.thumbnail || "",
              size: apiItem.size?.size || availableSizes[0] || "",
              availableSizes: availableSizes,
              qty: currentQty,
              quantity: currentQty,
              maxQty: apiItem.maxQty || product.maxQty || 10,
              baseMrp: baseMrp,
              basePrice: basePrice,
              mrp: baseMrp * currentQty,
              price: apiItem.itemTotal || basePrice * currentQty,
              returnDays: product.returnDays || 7,
              selected: true,

              // ==========================================
              // NEW: CAPTURE AVAILABILITY FLAGS
              // ==========================================
              isAvailable: sizeData.isAvailable !== false,
              isFewLeft: sizeData.isFewLeft === true,
            } as unknown as CartItem;
          });

          dispatch(setCartItems(mappedItems));
        }
      },
      onFail: (res: any) => {
        console.error("Failed to fetch cart:", res);
      },
    });
  }, [refreshKey]);

  const removeItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const moveToWishlist = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const changeQty = (cartItemId: string, qty: number) => {
    dispatch(updateQuantity({ cartItemId, quantity: qty }));
  };

  // We keep this just in case your OrderSummary component uses the 'details' prop 
  // for extra non-Redux logic (like delivery fees or taxes).
  const priceDetails = useMemo(
    () =>
      computePriceDetails(items, couponApplied ? COUPON_DISCOUNT : 0, donation),
    [items, couponApplied, donation],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <EmptyState
            icon={<FiShoppingBag size={28} className="text-dark/50" />}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Discover our collections and find your perfect fragrance."
            actionText="Continue Shopping"
            onAction={() => navigate("/products")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left: bag items */}
            <section className="space-y-4">
              <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
                <div className="mt-4 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {items.map((item: any) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        onRemove={removeItem}
                        onMoveToWishlist={moveToWishlist}
                        onQtyChange={changeQty}
                        onRefreshCart={refreshCart}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => navigate("/wishlist")}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 font-body text-sm font-medium text-admin-text transition-colors hover:border-primary-light"
              >
                Add More From Wishlist
                <span aria-hidden>→</span>
              </motion.button>
            </section>

            {/* Right: order summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <OrderSummary
                // 3. PUMP REDUX LIVE DATA DIRECTLY INTO THE UI 
                itemCount={totalItems}
                totalMrp={cartTotalMarkupPrice}
                discountOnMrp={cartTotalDiscount}
                totalAmount={cartTotalAmount}

                details={priceDetails}
                couponApplied={couponApplied}
                onApplyCoupon={() => setCouponApplied(true)}
                onRemoveCoupon={() => setCouponApplied(false)}
                onDonationChange={setDonation}
                onPlaceOrder={() => {
                  navigate(`/checkout/address`, {
                    state: {
                      from: "cart",
                    },
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
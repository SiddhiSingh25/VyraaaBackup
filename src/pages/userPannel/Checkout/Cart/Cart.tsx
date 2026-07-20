import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CartItem } from "./component/cart";
// import { sampleCartItems } from "./component/sampleCart"; // You can remove this now
import { computePriceDetails } from "./component/pricing";
// import OffersStrip from "./component/OffersStrip";
import CartListHeader from "./component/CartListHeader";
import CartItemCard from "./component/CartItemCard";
import OrderSummary from "./component/OrderSummary";
import TrustBadges from "./component/TrustBadges";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import { apiUrls } from "../../../../apis";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCartItems,
  toggleSelectItem,
  increaseQuantity,
  updateQuantity,
  removeFromCart,
} from "../../../../redux/slices/cartSlice";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";

const COUPON_DISCOUNT = 60;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Bind items to Redux store cart items
  const items = useSelector((state: any) => state.cart.items);
  const [couponApplied, setCouponApplied] = useState(false);
  const [donation, setDonation] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const { getQuery } = useGetQuery();

  const [cartData, setCartData] = useState<any>();

  const refreshCart = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    getQuery({
      url: apiUrls.Cart.getByUserId,
      onSuccess: (res: any) => {
        setCartData(res.data);
        console.log(res.data.items[0].product.title);
        // 2. Map the API response to the frontend `CartItem` shape with safe defaults
        if (res.data && res.data.items) {
          const mappedItems = res.data.items.map((apiItem: any) => {
            const product = apiItem.product || {};
            const priceList = product.price || [];
            const availableSizes = priceList
              .map((p: any) => p.size)
              .filter(Boolean);

            // 1. EXTRACT SINGLE UNIT PRICES
            const baseMrp =
              priceList?.[0]?.markupPrice || apiItem.unitPrice || 0;
            const basePrice = priceList?.[0]?.amount || apiItem.unitPrice || 0;
            const currentQty = apiItem.quantity || 1;

            return {
              id: apiItem._id,
              cartItemId: apiItem._id,
              brand: product.brand || product.manufacturer,
              name: product.title || "Product",
              soldBy: "VYRAAA",
              image: product.image || product.thumbnail || "",
              size: apiItem.size?.size || availableSizes[0] || "",
              availableSizes: availableSizes,
              qty: currentQty,
              quantity: currentQty,
              maxQty: apiItem.maxQty || product.maxQty || 10,

              // 2. STORE BASE PRICES FOR REDUX MATH
              baseMrp: baseMrp,
              basePrice: basePrice,

              // 3. CALCULATE INITIAL ROW TOTALS
              mrp: baseMrp * currentQty,
              price: apiItem.itemTotal || basePrice * currentQty,
              returnDays: product.returnDays || 7,
              selected: true,
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

  // const toggleSelect = (id: string) => {
  //   dispatch(toggleSelectItem(id));
  // };

  const removeItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const moveToWishlist = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const changeQty = (cartItemId: string, qty: number) => {
    // Now cartItemId correctly references the string passed into the function
    dispatch(updateQuantity({ cartItemId, quantity: qty }));
  };

  // const changeSize = (id: string, size: string) =>
  //   setItems((prev) => prev.map((i) => (i.id === id ? { ...i, size } : i)));

  const priceDetails = useMemo(
    () =>
      computePriceDetails(items, couponApplied ? COUPON_DISCOUNT : 0, donation),
    [items, couponApplied, donation],
  );

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface py-20 text-center">
            <p className="font-heading text-xl text-admin-text">
              Your bag is empty
            </p>
            <p className="font-body text-sm text-muted">
              Looks like you haven't added anything to your bag yet.
            </p>
            <a
              href="#"
              className="mt-2 rounded-md bg-primary px-6 py-2.5 font-body text-sm font-semibold tracking-wide text-background transition-colors hover:bg-primary-dark"
            >
              CONTINUE SHOPPING
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left: bag items */}
            <section className="space-y-4">
              {/* <OffersStrip /> */}

              <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
                {/* <CartListHeader
                  selectedCount={selectedCount}
                  totalCount={items.length}
                /> */}

                <div className="mt-4 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        // onToggleSelect={toggleSelect}
                        onRemove={removeItem}
                        onMoveToWishlist={moveToWishlist}
                        onQtyChange={changeQty}
                        onRefreshCart={refreshCart}
                        // onSizeChange={changeSize}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => navigate("/wishlist")} // 3. Add the navigation trigger
                className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 font-body text-sm font-medium text-admin-text transition-colors hover:border-primary-light"
              >
                Add More From Wishlist
                <span aria-hidden>→</span>
              </motion.button>
            </section>

            {/* Right: order summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <OrderSummary
                // 3. Fallback to your local computed details if API totals aren't updating locally on qty change
                itemCount={cartData?.totalItems || priceDetails.itemCount}
                totalMrp={
                  cartData?.cartTotalMarkupPrice || priceDetails.totalMrp
                }
                discountOnMrp={
                  cartData?.cartTotalDiscount || priceDetails.discountOnMrp
                }
                totalAmount={
                  cartData?.cartTotalAmount || priceDetails.totalAmount
                }
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
              {/* <div className="mt-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
                <TrustBadges />
              </div> */}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;

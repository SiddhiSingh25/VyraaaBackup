import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  // New states to track totals
  totalItems: 0,
  cartTotalAmount: 0,
  cartTotalMarkupPrice: 0,
  cartTotalDiscount: 0,
};

// Helper function to recalculate all totals dynamically
const recalculateCartTotals = (state) => {
  // 1. Calculate total distinct items (quantity of 3 still counts as 1 row/item)
  state.totalItems = state.items.length;

  let totalAmount = 0;
  let totalMarkup = 0;

  state.items.forEach((item) => {
    // We rely on the row-level totals (price and mrp) calculated during item updates
    totalAmount += item.price || 0;
    totalMarkup += item.mrp || 0;
  });

  // 2. Set the financial totals
  state.cartTotalAmount = totalAmount;
  state.cartTotalMarkupPrice = totalMarkup;
  // 3. Discount is the difference between MRP and actual payable amount
  state.cartTotalDiscount = totalMarkup - totalAmount;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === newItem.id && item.size === newItem.size,
      );
      const amt = newItem.quantity || newItem.qty || 1;

      if (existingItem) {
        existingItem.quantity =
          (existingItem.quantity || existingItem.qty || 1) + amt;
        existingItem.qty = existingItem.quantity;

        // RECALCULATE ROW TOTALS
        existingItem.mrp = (existingItem.baseMrp || 0) * existingItem.quantity;
        existingItem.price =
          (existingItem.basePrice || 0) * existingItem.quantity;
      } else {
        const uniqueCartId = newItem._id || `${newItem.id}-${newItem.size}`;
        // CAPTURE BASE PRICES IF NEW
        const bMrp = newItem.baseMrp || newItem.mrp || 0;
        const bPrice = newItem.basePrice || newItem.price || 0;

        state.items.push({
          ...newItem,
          cartItemId: uniqueCartId,
          baseMrp: bMrp,
          basePrice: bPrice,
          mrp: bMrp * amt,
          price: bPrice * amt,
          quantity: amt,
          qty: amt,
        });
      }

      // Update global totals
      recalculateCartTotals(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => (item.cartItemId || item.id) !== action.payload,
      );

      // Update global totals
      recalculateCartTotals(state);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => (item.cartItemId || item.id) === action.payload,
      );
      if (item) {
        item.quantity = (item.quantity || item.qty || 1) + 1;
        item.qty = item.quantity;

        // UPDATE ROW TOTALS
        item.mrp = (item.baseMrp || 0) * item.quantity;
        item.price = (item.basePrice || 0) * item.quantity;
      }

      // Update global totals
      recalculateCartTotals(state);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => (item.cartItemId || item.id) === action.payload,
      );
      if (item) {
        const currentQty = item.quantity || item.qty || 1;
        if (currentQty > 1) {
          item.quantity = currentQty - 1;
          item.qty = item.quantity;

          // UPDATE ROW TOTALS
          item.mrp = (item.baseMrp || 0) * item.quantity;
          item.price = (item.basePrice || 0) * item.quantity;
        }
      }

      // Update global totals
      recalculateCartTotals(state);
    },

    updateQuantity: (state, action) => {
      const { cartItemId, id, quantity } = action.payload;
      const item = state.items.find(
        (item) => (item.cartItemId || item.id) === (cartItemId || id),
      );
      if (item) {
        item.quantity = quantity;
        item.qty = quantity;

        // UPDATE ROW TOTALS
        item.mrp = (item.baseMrp || 0) * item.quantity;
        item.price = (item.basePrice || 0) * item.quantity;
      }

      // Update global totals
      recalculateCartTotals(state);
    },

    toggleSelectItem: (state, action) => {
      const item = state.items.find(
        (item) => (item.cartItemId || item.id) === action.payload,
      );
      if (item) {
        item.selected = item.selected === undefined ? false : !item.selected;
      }

      // NOTE: If you only want selected items to be calculated in the grand total,
      // you can update the `recalculateCartTotals` function to filter by `item.selected === true`.
    },

    setCartItems: (state, action) => {
      const incomingItems = Array.isArray(action.payload)
        ? action.payload
        : action.payload.items || [];

      state.items = incomingItems.map((item) => {
        const qty = item.quantity || item.qty || 1;
        const priceArrayObj = item.product?.price?.[0] || {};

        const bMrp =
          item.baseMrp || priceArrayObj.markupPrice || item.unitPrice || 0;
        const bPrice =
          item.basePrice || item.unitPrice || priceArrayObj.amount || 0;

        const id = item.product?._id || item.id;
        const sizeId = item.size?._id || item.size;

        return {
          ...item,
          id: id,
          size: sizeId,
          cartItemId: item._id || item.cartItemId || `${id}-${sizeId}`,
          baseMrp: bMrp,
          basePrice: bPrice,
          mrp: bMrp * qty,
          price: bPrice * qty,
          quantity: qty,
          qty: qty,
          selected: item.selected !== undefined ? item.selected : true,

          // ==========================================
          // PRESERVE AVAILABILITY FLAGS IN REDUX
          // ==========================================
          isAvailable: item.isAvailable !== false,
          isFewLeft: item.isFewLeft === true,
        };
      });

      recalculateCartTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.cartTotalAmount = 0;
      state.cartTotalMarkupPrice = 0;
      state.cartTotalDiscount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  toggleSelectItem,
  updateQuantity,
  setCartItems,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

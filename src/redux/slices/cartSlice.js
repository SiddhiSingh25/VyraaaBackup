import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
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
        // RECALCULATE TOTALS
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
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => (item.cartItemId || item.id) !== action.payload,
      );
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
    },

    toggleSelectItem: (state, action) => {
      const item = state.items.find(
        (item) => (item.cartItemId || item.id) === action.payload,
      );
      if (item) {
        item.selected = item.selected === undefined ? false : !item.selected;
      }
    },

    setCartItems: (state, action) => {
      state.items = action.payload.map((item) => ({
        ...item,
        cartItemId: item._id || item.cartItemId || `${item.id}-${item.size}`,
        quantity: item.quantity || item.qty || 1,
        qty: item.quantity || item.qty || 1,
        selected: item.selected !== undefined ? item.selected : true,
      }));
    },

    clearCart: (state) => {
      state.items = [];
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

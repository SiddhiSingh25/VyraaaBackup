import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, size, name, price, image, quantity, cartItemId, ...otherProductInfo }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;

      // 1. MATCH BY ID AND SIZE: Treat different sizes as completely distinct items
      const existingItem = state.items.find(
        (item) => item.id === newItem.id && item.size === newItem.size,
      );

      const amt = newItem.quantity || newItem.qty || 1;

      if (existingItem) {
        existingItem.quantity =
          (existingItem.quantity || existingItem.qty || 1) + amt;
        existingItem.qty = existingItem.quantity;
      } else {
        // 2. CREATE A UNIQUE CART ITEM ID (combining Product ID + Size)
        // This ensures increase/decrease functions target the correct size row!
        const uniqueCartId = newItem._id || `${newItem.id}-${newItem.size}`;

        state.items.push({
          ...newItem,
          cartItemId: uniqueCartId, // Save the unique ID
          quantity: amt,
          qty: amt,
        });
      }
    },

    // IMPORTANT: For the functions below, action.payload must now be the 'cartItemId',
    // NOT just the product 'id'. Otherwise, Redux won't know WHICH size to increase!

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
        }
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

    updateQuantity: (state, action) => {
      const { cartItemId, id, quantity } = action.payload;
      // Use cartItemId if provided, fallback to id
      const item = state.items.find(
        (item) => (item.cartItemId || item.id) === (cartItemId || id),
      );
      if (item) {
        item.quantity = quantity;
        item.qty = quantity;
      }
    },

    setCartItems: (state, action) => {
      state.items = action.payload.map((item) => ({
        ...item,
        // Ensure every item from backend has a unique cartItemId for the frontend to use
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

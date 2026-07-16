import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, name, price, image, quantity, ...otherProductInfo }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      const amt = newItem.quantity || newItem.qty || 1;

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || existingItem.qty || 1) + amt;
        existingItem.qty = existingItem.quantity;
      } else {
        state.items.push({ 
          ...newItem, 
          quantity: amt,
          qty: amt 
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity = (item.quantity || item.qty || 1) + 1;
        item.qty = item.quantity;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        const currentQty = item.quantity || item.qty || 1;
        if (currentQty > 1) {
          item.quantity = currentQty - 1;
          item.qty = item.quantity;
        }
      }
    },
    toggleSelectItem: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.selected = item.selected === undefined ? false : !item.selected;
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        item.qty = quantity;
      }
    },
    setCartItems: (state, action) => {
      state.items = action.payload.map(item => ({
        ...item,
        quantity: item.quantity || item.qty || 1,
        qty: item.quantity || item.qty || 1,
        selected: item.selected !== undefined ? item.selected : true
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

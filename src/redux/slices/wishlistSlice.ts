import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  id: string;
  brand: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  originalPrice: number | null;
  stockStatus: string;
  reviewCount: number;
  badge: string | null;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.some(
        (item) => item.id === action.payload.id
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload ?? [];
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  setWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
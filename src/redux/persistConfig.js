import storage from "redux-persist/lib/storage"; // localStorage for web

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // Only these three slices will be persisted to localStorage
  whitelist: ["auth", "cart", "wishlist"],
};

export default persistConfig;

// Custom local storage engine to bypass ESM/CJS interop issues in Vite dev mode
const customStorage = {
  getItem(key) {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch (e) {
      return Promise.resolve(null);
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // ignore quota or availability errors
    }
    return Promise.resolve();
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
    return Promise.resolve();
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage: customStorage,
  // Only these three slices will be persisted to localStorage
  whitelist: ["auth", "cart", "wishlist"],
};

export default persistConfig;

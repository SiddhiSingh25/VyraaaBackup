import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";

const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // Reset state to undefined, which forces all Redux reducers to return their initial state.
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;

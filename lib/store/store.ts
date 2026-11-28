import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { uiSlice } from "./slices/ui-slice";

// Combined once, when this module loads. combineReducers calls Math.random()
// to probe each reducer; doing that inside makeStore() would run it during
// render, which Cache Components blocks ("unstable value Math.random()").
const rootReducer = combineReducers({
  [uiSlice.reducerPath]: uiSlice.reducer, // state.ui = { isCommandPaletteOpen: false }
  // add new slices here
});

/**
 * A Redux store with every slice reducer.
 * See docs/wiring/redux-toolkit-setup.md.
 */
export function makeStore() {
  return configureStore({
    reducer: rootReducer, // a function, so configureStore doesn't combine again
    // devTools is on by default outside production
  });
}

// Types come from the store itself, so they update when a slice is added
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

let browserStore: AppStore | undefined;

/** The store to use: one per server request, one per browser tab. */
export function getStore() {
  // Server render: a fresh store per request, so users never share state
  if (typeof window === "undefined") return makeStore();
  // Browser: create once, reuse for the life of the tab
  browserStore ??= makeStore();
  return browserStore;
}

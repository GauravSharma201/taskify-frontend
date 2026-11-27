import { configureStore } from "@reduxjs/toolkit";

import { uiSlice } from "./slices/ui-slice";

/**
 * A Redux store with every slice reducer.
 * See docs/wiring/redux-toolkit-setup.md.
 */
export function makeStore() {
  return configureStore({
    reducer: {
      [uiSlice.reducerPath]: uiSlice.reducer, // state.ui = { isCommandPaletteOpen: false }
      // add new slices here
    },
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

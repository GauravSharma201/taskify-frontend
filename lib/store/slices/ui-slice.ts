import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** App-wide UI state that several distant components share. */
type UiState = {
  isCommandPaletteOpen: boolean;
};

const initialState: UiState = {
  isCommandPaletteOpen: false,
};

export const uiSlice = createSlice({
  name: "ui", // action types become "ui/openCommandPalette", …; state lives at state.ui
  initialState,
  reducers: {
    // Looks like mutation, but Immer turns it into a new object
    openCommandPalette: (state) => {
      state.isCommandPaletteOpen = true;
    },
    closeCommandPalette: (state) => {
      state.isCommandPaletteOpen = false;
    },
    // payload = true | false, e.g. from Command's onOpenChange
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.isCommandPaletteOpen = action.payload;
    },
  },
  selectors: {
    selectIsCommandPaletteOpen: (state) => state.isCommandPaletteOpen,
  },
});

export const { openCommandPalette, closeCommandPalette, setCommandPaletteOpen } = uiSlice.actions;
export const { selectIsCommandPaletteOpen } = uiSlice.selectors;

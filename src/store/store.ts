import { configureStore } from "@reduxjs/toolkit";
import { tabsSlice } from "./tabs/tabsSlice";

const store = configureStore({
  reducer: {
    tabs: tabsSlice.reducer,
  },
});

// Save to localStorage whenever state changes
store.subscribe(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "exonnTabsState",
      JSON.stringify(store.getState().tabs)
    );
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };

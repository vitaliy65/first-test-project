import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { allTabs } from "@/data/tabs";
import { TabType } from "@/types/types";

interface TabsState {
  visibleTabs: TabType[];
  activeTabId: string | null;
  hiddenTabs: TabType[];
  showSidebar: boolean;
}

const initialState: TabsState = {
  visibleTabs: allTabs,
  activeTabId: allTabs[0]?.id || null,
  hiddenTabs: [],
  showSidebar: true,
};

export const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    reorderTabs: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;

      const [movedTab] = state.visibleTabs.splice(fromIndex, 1);
      state.visibleTabs.splice(toIndex, 0, movedTab);

      // Ensure pinned tabs remain at the beginning, maintaining their relative order
      state.visibleTabs.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });

      // Update positions after reordering and sorting
      state.visibleTabs.forEach((tab, index) => {
        tab.position = index;
      });
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTabId = action.payload;
    },
    addTabFromHidden: (state, action: PayloadAction<string>) => {
      const tabIndex = state.hiddenTabs.findIndex(
        (tab) => tab.id === action.payload
      );
      if (tabIndex !== -1) {
        const [tab] = state.hiddenTabs.splice(tabIndex, 1);
        state.visibleTabs.push(tab);
        state.activeTabId = tab.id;
      }
    },
    moveTabToHidden: (state, action: PayloadAction<string>) => {
      const tabIndex = state.visibleTabs.findIndex(
        (tab) => tab.id === action.payload
      );
      if (tabIndex !== -1) {
        const [tab] = state.visibleTabs.splice(tabIndex, 1);
        state.hiddenTabs.push(tab);
        if (state.activeTabId === action.payload) {
          state.activeTabId = state.visibleTabs[0]?.id || null;
        }
      }
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },
    toggleTabPin: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      const tabIndex = state.visibleTabs.findIndex((tab) => tab.id === tabId);

      if (tabIndex !== -1) {
        const [tab] = state.visibleTabs.splice(tabIndex, 1);
        tab.isPinned = !tab.isPinned;

        if (tab.isPinned) {
          // Find the last pinned tab to insert after it
          let insertIndex = 0;
          for (let i = 0; i < state.visibleTabs.length; i++) {
            if (state.visibleTabs[i].isPinned) {
              insertIndex = i + 1;
            } else {
              break; // Found the first unpinned tab, insert before it
            }
          }
          state.visibleTabs.splice(insertIndex, 0, tab);
        } else {
          // If unpinning, add to the end of unpinned tabs
          state.visibleTabs.push(tab);
        }
      }
    },
    removeTab: (state, action: PayloadAction<string>) => {
      state.visibleTabs = state.visibleTabs.filter(
        (tab) => tab.id !== action.payload
      );
      if (state.activeTabId === action.payload) {
        state.activeTabId = state.visibleTabs[0]?.id || null;
      }
      state.visibleTabs.forEach((tab, index) => {
        tab.position = index;
      });
    },
  },
});

export const {
  reorderTabs,
  setActiveTab,
  addTabFromHidden,
  moveTabToHidden,
  setSidebar,
  toggleTabPin,
  removeTab,
} = tabsSlice.actions;

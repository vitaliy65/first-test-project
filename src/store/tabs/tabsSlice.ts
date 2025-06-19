import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { allTabs } from "@/data/tabs";
import { TabType } from "@/types/types";

interface TabsState {
  visibleTabs: TabType[];
  activeTabId: string | null;
  hiddenTabs: TabType[];
  showSidebar: boolean;
}

const loadState = (): TabsState => {
  if (typeof window !== "undefined") {
    try {
      const serializedState = localStorage.getItem("exonnTabsState");
      if (serializedState === null) {
        return {
          visibleTabs: allTabs,
          activeTabId: allTabs[0]?.id || null,
          hiddenTabs: [],
          showSidebar: true,
        };
      }
      return JSON.parse(serializedState);
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
      return {
        visibleTabs: allTabs,
        activeTabId: allTabs[0]?.id || null,
        hiddenTabs: [],
        showSidebar: true,
      };
    }
  }
  return {
    visibleTabs: allTabs,
    activeTabId: allTabs[0]?.id || null,
    hiddenTabs: [],
    showSidebar: true,
  };
};

const initialState: TabsState = loadState();

export const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    updateTabsOrder: (state, action: PayloadAction<TabType[]>) => {
      const updatedTabs = action.payload.map((tab, index) => ({
        ...tab,
        position: index,
      }));
      state.visibleTabs = updatedTabs;
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
    togglePinTab: (state, action: PayloadAction<string>) => {
      const tab = state.visibleTabs.find((t) => t.id === action.payload);
      if (tab) {
        tab.isPinned = !tab.isPinned;
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
  updateTabsOrder,
  setActiveTab,
  addTabFromHidden,
  moveTabToHidden,
  setSidebar,
  togglePinTab,
  removeTab,
} = tabsSlice.actions;

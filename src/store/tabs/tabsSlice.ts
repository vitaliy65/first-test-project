import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Tab {
  id: string;
  name: string;
  icon?: string;
  url: string;
  isActive?: boolean;
  isPinned?: boolean;
}

interface TabsState {
  visibleTabs: Tab[];
  activeTabId: string | null;
  hiddenTabs: Tab[];
  showSidebar: boolean;
}

const allTabs: Tab[] = [
  { id: "dashboard", name: "Dashboard", url: "/dashboard", icon: "📊" },
  { id: "banking", name: "Banking", url: "/banking", icon: "🏦" },
  { id: "telefonie", name: "Telefonie", url: "/telefonie", icon: "📞" },
  { id: "accounting", name: "Accounting", url: "/accounting", icon: "📋" },
  { id: "verkauf", name: "Verkauf", url: "/verkauf", icon: "💼" },
  { id: "statistik", name: "Statistik", url: "/statistik", icon: "📈" },
  { id: "post-office", name: "Post Office", url: "/post-office", icon: "📮" },
  {
    id: "administration",
    name: "Administration",
    url: "/administration",
    icon: "⚙️",
  },
  { id: "help", name: "Help", url: "/help", icon: "❓" },
  {
    id: "warenbestand",
    name: "Warenbestand",
    url: "/warenbestand",
    icon: "📦",
  },
  {
    id: "auswahllisten",
    name: "Auswahllisten",
    url: "/auswahllisten",
    icon: "📝",
  },
  { id: "einkauf", name: "Einkauf", url: "/einkauf", icon: "🛒" },
  {
    id: "lagerverwaltung",
    name: "Lagerverwaltung",
    url: "/lagerverwaltung",
    icon: "🏪",
  },
];

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
      const visibleTabIndex = state.visibleTabs.findIndex(
        (tab) => tab.id === tabId
      );
      if (visibleTabIndex !== -1) {
        state.visibleTabs[visibleTabIndex].isPinned =
          !state.visibleTabs[visibleTabIndex].isPinned;
      } else {
        const hiddenTabIndex = state.hiddenTabs.findIndex(
          (tab) => tab.id === tabId
        );
        if (hiddenTabIndex !== -1) {
          state.hiddenTabs[hiddenTabIndex].isPinned =
            !state.hiddenTabs[hiddenTabIndex].isPinned;
        }
      }
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
} = tabsSlice.actions;

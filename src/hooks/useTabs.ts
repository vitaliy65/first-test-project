import { useMemo, useCallback } from "react";
import {
  updateTabsOrder,
  togglePinTab,
  removeTab,
  setActiveTab,
  moveTabToHidden,
  addTabFromHidden,
} from "@/store/tabs/tabsSlice";
import { TabType } from "../types/types";
import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";

export const useTabs = () => {
  const dispatch = useAppDispatch();
  const { visibleTabs, activeTabId, hiddenTabs } = useAppSelector(
    (state) => state.tabs
  );

  const sortedTabs = useMemo(() => {
    return [...visibleTabs].sort((a, b) => a.position - b.position);
  }, [visibleTabs]);

  const pinnedTabs = useMemo(() => {
    return sortedTabs.filter((tab) => tab.isPinned);
  }, [sortedTabs]);

  const unpinnedTabs = useMemo(() => {
    return sortedTabs.filter((tab) => !tab.isPinned);
  }, [sortedTabs]);

  const handleUpdateTabsOrder = (newTabs: TabType[]) => {
    dispatch(updateTabsOrder(newTabs));
  };

  const handleTogglePinTab = (tabId: string) => {
    dispatch(togglePinTab(tabId));
  };

  const handleRemoveTab = (tabId: string) => {
    dispatch(removeTab(tabId));
  };

  const handleSetActiveTab = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };

  const handleAddTabFromHidden = (tabId: string) => {
    dispatch(addTabFromHidden([tabId]));
  };

  const handleMoveTabToHidden = (tabId: string) => {
    dispatch(moveTabToHidden([tabId]));
  };

  const syncTabsVisibility = useCallback(
    (tabsToHide: string[], tabsToShow: string[]) => {
      if (tabsToHide.length > 0) {
        dispatch(moveTabToHidden(tabsToHide));
      }
      if (tabsToShow.length > 0) {
        dispatch(addTabFromHidden(tabsToShow));
      }
    },
    [dispatch]
  );

  return {
    visibleTabs: sortedTabs,
    pinnedTabs,
    hiddenTabs,
    unpinnedTabs,
    updateTabsOrder: handleUpdateTabsOrder,
    togglePinTab: handleTogglePinTab,
    addTabFromHidden: handleAddTabFromHidden,
    moveTabToHidden: handleMoveTabToHidden,
    removeTab: handleRemoveTab,
    setActiveTab: handleSetActiveTab,
    activeTabId,
    syncTabsVisibility,
  };
};

// Тип для RootState (замените на ваш реальний тип)
export interface RootState {
  tabs: {
    visibleTabs: TabType[];
    activeTabId: string | null;
    hiddenTabs: TabType[];
    showSidebar: boolean;
  };
}

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

  // Сортируем вкладки по позиции
  const sortedTabs = [...visibleTabs].sort((a, b) => a.position - b.position);

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
    dispatch(addTabFromHidden(tabId));
  };

  const handleMoveTabToHidden = (tabId: string) => {
    dispatch(moveTabToHidden(tabId));
  };

  // Разделяем закрепленные и обычные вкладки
  const pinnedTabs = sortedTabs.filter((tab) => tab.isPinned);
  const unpinnedTabs = sortedTabs.filter((tab) => !tab.isPinned);

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
  };
};

// Тип для RootState (замените на ваш реальный тип)
export interface RootState {
  tabs: {
    visibleTabs: TabType[];
    activeTabId: string | null;
    hiddenTabs: TabType[];
    showSidebar: boolean;
  };
}

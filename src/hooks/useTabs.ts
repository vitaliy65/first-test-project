import {
  updateTabsOrder,
  togglePinTab,
  removeTab,
  setActiveTab,
} from "@/store/tabs/tabsSlice";
import { TabType } from "../types/types";
import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";

export const useTabs = () => {
  const dispatch = useAppDispatch();
  const { visibleTabs, activeTabId } = useAppSelector((state) => state.tabs);

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

  // Разделяем закрепленные и обычные вкладки
  const pinnedTabs = sortedTabs.filter((tab) => tab.isPinned);
  const unpinnedTabs = sortedTabs.filter((tab) => !tab.isPinned);

  return {
    visibleTabs: sortedTabs,
    pinnedTabs,
    unpinnedTabs,
    updateTabsOrder: handleUpdateTabsOrder,
    togglePinTab: handleTogglePinTab,
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

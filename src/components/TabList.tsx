import React, { useEffect, useRef } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import TabItem from "./TabItem";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useTabs } from "@/hooks/useTabs";
import DropDownMenu from "./DropDownMenu";

interface Props {
  activeTab: string | null;
  onSetActive: (id: string) => void;
  onPin: (id: string) => void;
  onRemove: (id: string) => void;
  draggedTabId: UniqueIdentifier | null;
}

const TabList: React.FC<Props> = ({
  activeTab,
  onSetActive,
  onPin,
  onRemove,
  draggedTabId,
}) => {
  const {
    pinnedTabs,
    unpinnedTabs,
    hiddenTabs,
    syncTabsVisibility,
    visibleTabs,
  } = useTabs();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width: containerWidth } = entries[0].contentRect;

      if (!containerRef.current) return;

      const tabElementsInDOM = containerRef.current.querySelectorAll(".tab");
      const renderedTabWidths = new Map<string, number>();
      tabElementsInDOM.forEach((el) => {
        const id = (el as HTMLElement).dataset.id;
        if (id) {
          renderedTabWidths.set(id, el.getBoundingClientRect().width);
        }
      });

      const newTabsToHide: string[] = [];
      const newTabsToShow: string[] = [];
      let accumulatedIdealWidth = 0;

      const allTabsCombinedAndSorted = [
        ...pinnedTabs,
        ...unpinnedTabs,
        ...hiddenTabs,
      ].sort((a, b) => a.position - b.position);

      const currentVisibleFromStore = new Set(visibleTabs.map((t) => t.id));
      const idealVisibleSet = new Set<string>();

      // Визначаємо ідеальний набір видимих вкладок
      for (const tab of allTabsCombinedAndSorted) {
        // Використовуємо фактичну ширину, якщо вкладка відображена, або оцінку 120px, якщо прихована.
        const tabWidth = renderedTabWidths.get(tab.id) || 120;

        if (accumulatedIdealWidth + tabWidth <= containerWidth) {
          accumulatedIdealWidth += tabWidth;
          idealVisibleSet.add(tab.id);
        } else {
          // Якщо ця вкладка не поміщається, то й наступні також не помістяться.
          break;
        }
      }

      // Обчислюємо, які вкладки потрібно приховати, а які показати
      for (const tabId of currentVisibleFromStore) {
        if (!idealVisibleSet.has(tabId)) {
          newTabsToHide.push(tabId);
        }
      }

      for (const tabId of idealVisibleSet) {
        if (!currentVisibleFromStore.has(tabId)) {
          newTabsToShow.push(tabId);
        }
      }
      syncTabsVisibility(newTabsToHide, newTabsToShow);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [
    pinnedTabs.length,
    unpinnedTabs.length,
    hiddenTabs.length,
    visibleTabs.length,
  ]);

  return (
    <div ref={containerRef} className="flex min-h-12  relative">
      <div className="flex flex-grow">
        {[pinnedTabs, unpinnedTabs].map((group, i) => (
          <SortableContext
            key={i}
            items={group.map((tab) => tab.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex bg-background shrink-0">
              {group.map((tab, index) => (
                <React.Fragment key={tab.id}>
                  <TabItem
                    tab={tab}
                    isActive={tab.id === activeTab}
                    onClick={() => onSetActive(tab.id)}
                    onPin={() => onPin(tab.id)}
                    onRemove={() => onRemove(tab.id)}
                    draggedTabId={draggedTabId}
                  />
                  {index < group.length - 1 && (
                    <div className="tab-separator"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </SortableContext>
        ))}
      </div>
      {hiddenTabs.length > 0 && <DropDownMenu />}
    </div>
  );
};

export default TabList;

import React, { useState, useEffect, useRef } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import TabItem from "./TabItem";
import { TabType } from "@/types/types";
import { UniqueIdentifier } from "@dnd-kit/core";
import OverflowDropdown from "./OverflowDropdown";

interface Props {
  tabs: TabType[];
  activeTab: string | null;
  onSetActive: (id: string) => void;
  onPin: (id: string) => void;
  onRemove: (id: string) => void;
  draggedTabId: UniqueIdentifier | null;
  containerWidth: number;
}

const TabList: React.FC<Props> = ({
  tabs,
  activeTab,
  onSetActive,
  onPin,
  onRemove,
  draggedTabId,
  containerWidth,
}) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [visibleTabItems, setVisibleTabItems] = useState<TabType[]>([]);
  const [overflowTabItems, setOverflowTabItems] = useState<TabType[]>([]);

  useEffect(() => {
    if (!tabsContainerRef.current) return;

    const tabItemWidth = 180;
    const availableWidth = tabsContainerRef.current.offsetWidth;

    let currentVisible: TabType[] = [];
    let currentOverflow: TabType[] = [];

    const pinnedTabs = tabs.filter((tab) => tab.isPinned);
    const unpinnedTabs = tabs.filter((tab) => !tab.isPinned);

    let remainingWidth = availableWidth;

    for (const tab of pinnedTabs) {
      if (remainingWidth >= tabItemWidth) {
        currentVisible.push(tab);
        remainingWidth -= tabItemWidth;
      } else {
        currentOverflow.push(tab);
      }
    }

    for (const tab of unpinnedTabs) {
      if (remainingWidth >= tabItemWidth) {
        currentVisible.push(tab);
        remainingWidth -= tabItemWidth;
      } else {
        currentOverflow.push(tab);
      }
    }

    setVisibleTabItems(currentVisible);
    setOverflowTabItems(currentOverflow);
  }, [tabs, containerWidth]);

  const pinned = visibleTabItems.filter((tab) => tab.isPinned);
  const unpinned = visibleTabItems.filter((tab) => !tab.isPinned);

  return (
    <div ref={tabsContainerRef} className="flex">
      {[pinned, unpinned].map((group, i) => (
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
      {overflowTabItems.length > 0 && (
        <OverflowDropdown
          tabs={overflowTabItems}
          onSetActive={onSetActive}
          onPin={onPin}
          onRemove={onRemove}
        />
      )}
    </div>
  );
};

export default TabList;

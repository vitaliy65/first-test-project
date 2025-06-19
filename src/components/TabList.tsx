import React, { useRef } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import TabItem from "./TabItem";
import { TabType } from "@/types/types";
import { UniqueIdentifier } from "@dnd-kit/core";

interface Props {
  tabs: TabType[];
  activeTab: string | null;
  onSetActive: (id: string) => void;
  onPin: (id: string) => void;
  onRemove: (id: string) => void;
  draggedTabId: UniqueIdentifier | null;
}

const TabList: React.FC<Props> = ({
  tabs,
  activeTab,
  onSetActive,
  onPin,
  onRemove,
  draggedTabId,
}) => {
  const pinned = tabs.filter((tab) => tab.isPinned);
  const unpinned = tabs.filter((tab) => !tab.isPinned);
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="flex min-h-12">
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
    </div>
  );
};

export default TabList;

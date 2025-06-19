"use client";

import React, { ReactNode, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  DragStartEvent,
  DragOverEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import TabList from "./TabList";
import { TabType } from "@/types/types";
import { useState } from "react";
import { useTabs } from "@/hooks/useTabs";

interface TabsLayoutProps {
  children: ReactNode;
}

export default function TabsContainer({ children }: TabsLayoutProps) {
  const {
    visibleTabs: tabs,
    activeTabId: activeTab,
    updateTabsOrder,
    setActiveTab,
    togglePinTab,
    removeTab,
  } = useTabs();
  const [draggedTabId, setDraggedTabId] = useState<UniqueIdentifier | null>(
    null
  );
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggedTabId(event.active.id);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = tabs.findIndex((t: TabType) => t.id === active.id);
        const newIndex = tabs.findIndex((t: TabType) => t.id === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newTabs = arrayMove(tabs, oldIndex, newIndex);
          updateTabsOrder(newTabs);
        }
      }
    },
    [tabs, updateTabsOrder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedTabId(null);
  }, []);

  return (
    <DndContext
      sensors={[sensor]}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <main className="main-container">
        <div className="left-margin"></div>
        <div className="flex flex-col w-full min-h-screen">
          <div className="upper-margin"></div>
          <div className="flex flex-col w-full h-full">
            <TabList
              tabs={tabs}
              activeTab={activeTab}
              onSetActive={setActiveTab}
              onPin={togglePinTab}
              onRemove={removeTab}
              draggedTabId={draggedTabId}
            />
            <div className="p-4 w-full h-full bg-background-alt">
              <div className="w-full h-full bg-background border border-border rounded-md">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </DndContext>
  );
}

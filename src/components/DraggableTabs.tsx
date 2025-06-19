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

import TabList from "./TabList";
import { TabType } from "@/types/types";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  reorderTabs,
  toggleTabPin,
  removeTab,
  setActiveTab,
} from "@/store/tabs/tabsSlice";
import { RootState } from "@/store/store";
import { useState } from "react";

interface TabsLayoutProps {
  children: ReactNode;
}

export default function TabsContainer({ children }: TabsLayoutProps) {
  const dispatch = useAppDispatch();
  const { visibleTabs: tabs, activeTabId: activeTab } = useAppSelector(
    (state: RootState) => state.tabs
  );
  const [draggedTabId, setDraggedTabId] = useState<UniqueIdentifier | null>(
    null
  );
  const sensor = useSensor(PointerSensor);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggedTabId(event.active.id);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const activeIndex = tabs.findIndex((t: TabType) => t.id === active.id);
        const overIndex = tabs.findIndex((t: TabType) => t.id === over?.id);
        dispatch(reorderTabs({ fromIndex: activeIndex, toIndex: overIndex }));
      }
    },
    [tabs, dispatch]
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
              onSetActive={(id) => dispatch(setActiveTab(id))}
              onPin={(id) => dispatch(toggleTabPin(id))}
              onRemove={(id) => dispatch(removeTab(id))}
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

import React from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { TabType } from "@/types/types";
import { addTabFromHidden, setActiveTab } from "@/store/tabs/tabsSlice";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DropDownMenu() {
  const dispatch = useAppDispatch();
  const hiddenTabs = useAppSelector((state) => state.tabs.hiddenTabs);

  const handleTabClick = (tabId: string) => {
    dispatch(addTabFromHidden([tabId]));
    dispatch(setActiveTab(tabId));
  };

  const tabsInMenu = hiddenTabs;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`dropdown-menu-trigger`}
          aria-label="Відкрити меню вкладок"
        >
          <ChevronDown size={16} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="dropdown-menu-content" sideOffset={5}>
          <ul className="dropdown-menu-list">
            {tabsInMenu.map((tab: TabType) => (
              <DropdownMenu.Item
                key={tab.id}
                onSelect={() => handleTabClick(tab.id)}
                asChild
              >
                <Link href={tab.url} className="dropdown-menu-item">
                  <Image
                    src={tab.icon}
                    alt={tab.title}
                    width={16}
                    height={16}
                  />
                  <span className="truncate">{tab.title}</span>
                </Link>
              </DropdownMenu.Item>
            ))}
          </ul>
          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pin, PinOff, X } from "lucide-react";
import { TabType } from "@/types/types";
import { UniqueIdentifier } from "@dnd-kit/core";

interface Props {
  tab: TabType;
  isActive: boolean;
  onClick: () => void;
  onPin: () => void;
  onRemove: () => void;
  draggedTabId: UniqueIdentifier | null;
}

const TabItem: React.FC<Props> = ({
  tab,
  isActive,
  onClick,
  onPin,
  onRemove,
  draggedTabId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: tab.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-3 py-2 flex items-center gap-2 min-w-[100px] max-w-[200px] truncate cursor-pointer select-none
        ${
          isActive
            ? "border-t-2 border-activeTabBorder text-activeTabText bg-background-alt"
            : ""
        }
        ${tab.isPinned ? "" : ""}
        ${tab.id === draggedTabId && "bg-gray-500 text-white"}
      `}
      onClick={onClick}
    >
      <tab.icon size={16} />
      <span className="truncate flex-1">{tab.title}</span>
      {/* <button onClick={onPin}>{tab.isPinned ? <PinOff /> : <Pin />}</button>
      <button onClick={onRemove}>
        <X />
      </button> */}
    </div>
  );
};

export default TabItem;

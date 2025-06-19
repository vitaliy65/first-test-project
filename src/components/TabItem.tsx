import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pin, PinOff, X } from "lucide-react";
import { TabType } from "@/types/types";
import { UniqueIdentifier } from "@dnd-kit/core";
import Image from "next/image";

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
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`tab
        ${tab.isPinned ? "pinned" : ""}
        ${tab.id === draggedTabId ? "drag" : ""}
        ${isActive ? "active" : ""}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Image src={tab.icon} alt={tab.title} width={16} height={16} />
      <span className="truncate flex-1">{tab.title}</span>
      {isHover && (
        <button onClick={onRemove} className="delete-tab">
          <X size={12} />
        </button>
      )}
      {/* <button onClick={onPin}>{tab.isPinned ? <PinOff /> : <Pin />}</button>
      <button onClick={onRemove}>
        <X />
      </button> */}
    </div>
  );
};

export default TabItem;

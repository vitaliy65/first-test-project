import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { TabType } from "@/types/types";
import { UniqueIdentifier } from "@dnd-kit/core";
import Image from "next/image";
import PinTabModal from "./PinTabModal";

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

  const handleMouseLeave = () => {
    setTimeout(() => setIsHover(false), 100);
  };

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
      onMouseLeave={handleMouseLeave}
    >
      {/* tab icon */}
      <Image src={tab.icon} alt={tab.title} width={16} height={16} />

      {/* tab title */}
      <span className="truncate flex-1">{tab.title}</span>

      {/* show delete button when hover */}
      {isHover && (
        <button onClick={onRemove} className="delete-tab">
          <X size={12} />
        </button>
      )}

      {/* pin modal */}
      <PinTabModal
        isPinned={tab.isPinned}
        show={isHover}
        isDragging={tab.id === draggedTabId}
        onPin={onPin}
      />
    </div>
  );
};

export default TabItem;

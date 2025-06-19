"use client";

import React, { useState } from "react";
import { Pin, PinOff } from "lucide-react";

interface PinTabModalProps {
  show: boolean;
  onPin: () => void;
  isPinned: boolean | undefined;
  isDragging: boolean;
}

export default function PinTabModal({
  isPinned,
  show,
  onPin,
  isDragging,
}: PinTabModalProps) {
  const [isHovering, setIsHovering] = useState(false);

  return isHovering || (show && !isDragging) ? (
    <div
      className="pin-tab"
      onClick={onPin}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
      {isPinned ? <span>unpin tab</span> : <span>pin tab</span>}
    </div>
  ) : null;
}

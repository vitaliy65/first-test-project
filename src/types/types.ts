import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

export interface TabType {
  id: string;
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  url: string;
  isActive?: boolean;
  isPinned?: boolean;
  position: number;
}

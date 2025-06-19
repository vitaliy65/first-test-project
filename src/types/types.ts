export interface TabType {
  id: string;
  title: string;
  icon: string;
  url: string;
  isActive?: boolean;
  isPinned?: boolean;
  position: number;
}

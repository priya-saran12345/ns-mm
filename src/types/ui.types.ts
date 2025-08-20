export interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: ('admin' | 'user' | 'manager')[];
  children?: SidebarItem[];
}

export interface UIState {
  sidebarCollapsed: boolean;
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
}

export type SidebarItem = {
  id: string;
  title: string;
  href: string;
  icon: string;
  visible: boolean;
  customTitle?: string;
};

export type SidebarPreferences = {
  id?: string;
  user_id?: string;
  sidebar_items: SidebarItem[];
  created_at?: string;
  updated_at?: string;
};

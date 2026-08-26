export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  permission?: string;
  exact?: boolean;
}

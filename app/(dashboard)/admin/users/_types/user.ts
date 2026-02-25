

export interface SortAccount {
  id:     string;
  name:   string;
  email:  string;
  role:   "Admin" | "Editor" | "Viewer";
  avatar: string;
}

export type Book = {
  id: number;
  title: string;
  is_favourite: boolean;
  path: string;
  full_link: string;
  mime_type: string;
  last_read_at?: string;
  text?: string;
};

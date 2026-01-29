export interface MovieForm {
  id: number | null;
  name: string;
  publication_date: string;
  image: string | null;
  status: number | boolean;
  shifts: number[];
}

export type Student = {
  id: number;
  name: string;
  email: string;
  university: string | null;
  graduation_year: number | null;
  skills: string | null;
};

export type Company = {
  id: number;
  name: string;
  email: string;
};

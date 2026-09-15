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

export type Message = {
  id: number;
  sender_type: "company" | "student";
  body: string;
  created_at: string;
};

export type Conversation = {
  id: number;
  company: Company;
  student: Student;
  messages?: Message[];
  created_at: string;
  updated_at: string;
};

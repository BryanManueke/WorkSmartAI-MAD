export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  skills: string[];
  interests: string;
  education: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  matchScore?: number;
}

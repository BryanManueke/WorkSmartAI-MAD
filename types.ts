export interface User {
  id: string;
  _id?: string;
  name: string;
  role?: string;
  email?: string;
  avatar?: string;
  skills?: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  logo: string;
  category: string;
  type: string;
  description: string;
  banner: string;
  requirements: string[];
  responsibilities?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

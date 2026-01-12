export interface Skill {
  name: string;
  category: 'AI/ML' | 'Frontend' | 'Backend' | 'DevOps' | 'Healthcare' | 'Product' | 'Leadership';
  level: number; // 1-100
}

export interface Language {
  name: string;
  level: 'Native' | 'Fluent' | 'Intermediate' | 'Basic';
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface Internship {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Award {
  title: string;
  organization: string;
  date: string;
  description: string;
  investment?: string;
  link?: string;
}

export interface Project {
  title: string;
  role: string;
  description: string;
  technologies?: string[];
}
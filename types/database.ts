// Database table types matching the Supabase schema

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  
  // Personal Information
  full_name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  website?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  professional_summary?: string | null;
  
  // Metadata
  is_public: boolean;
  template_name: string;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: string;
  resume_id: string;
  company_name: string;
  position: string;
  location?: string | null;
  start_date: string; // ISO date string
  end_date?: string | null; // ISO date string
  is_current: boolean;
  description?: string | null;
  achievements?: string[] | null;
  technologies?: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  resume_id: string;
  institution_name: string;
  degree: string;
  field_of_study?: string | null;
  location?: string | null;
  start_date?: string | null; // ISO date string
  end_date?: string | null; // ISO date string
  is_current: boolean;
  gpa?: string | null;
  honors?: string[] | null;
  relevant_coursework?: string[] | null;
  description?: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  resume_id: string;
  category: string;
  skill_name: string;
  proficiency_level?: string | null;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  resume_id: string;
  project_name: string;
  description: string;
  role?: string | null;
  start_date?: string | null; // ISO date string
  end_date?: string | null; // ISO date string
  is_ongoing: boolean;
  technologies?: string[] | null;
  project_url?: string | null;
  github_url?: string | null;
  highlights?: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  resume_id: string;
  certification_name: string;
  issuing_organization: string;
  issue_date?: string | null; // ISO date string
  expiry_date?: string | null; // ISO date string
  credential_id?: string | null;
  credential_url?: string | null;
  description?: string | null;
  display_order: number;
  created_at: string;
}

export interface Award {
  id: string;
  resume_id: string;
  award_name: string;
  issuing_organization: string;
  date_received?: string | null; // ISO date string
  description?: string | null;
  display_order: number;
  created_at: string;
}

export interface Language {
  id: string;
  resume_id: string;
  language_name: string;
  proficiency_level: string;
  display_order: number;
  created_at: string;
}

// Complete resume with all related data
export interface ResumeWithDetails extends Resume {
  work_experiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  languages: Language[];
}

// Form input types (without id, timestamps, and resume_id for creation)
export type ResumeInput = Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export type WorkExperienceInput = Omit<WorkExperience, 'id' | 'resume_id' | 'created_at' | 'updated_at'>;

export type EducationInput = Omit<Education, 'id' | 'resume_id' | 'created_at' | 'updated_at'>;

export type SkillInput = Omit<Skill, 'id' | 'resume_id' | 'created_at'>;

export type ProjectInput = Omit<Project, 'id' | 'resume_id' | 'created_at' | 'updated_at'>;

export type CertificationInput = Omit<Certification, 'id' | 'resume_id' | 'created_at'>;

export type AwardInput = Omit<Award, 'id' | 'resume_id' | 'created_at'>;

export type LanguageInput = Omit<Language, 'id' | 'resume_id' | 'created_at'>;


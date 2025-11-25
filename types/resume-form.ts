// Form data types for resume creation/editing

export interface ResumeFormData {
  // Basic Info
  title: string;
  
  // Personal Information
  full_name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin_url: string;
  github_url: string;
  professional_summary: string;
  
  // Related sections
  work_experiences: WorkExperienceFormData[];
  education: EducationFormData[];
  skills: SkillFormData[];
  projects: ProjectFormData[];
  certifications: CertificationFormData[];
  awards: AwardFormData[];
  languages: LanguageFormData[];
  
  // Metadata
  is_public: boolean;
  template_name: string;
}

export interface WorkExperienceFormData {
  company_name: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface EducationFormData {
  institution_name: string;
  degree: string;
  field_of_study: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  gpa: string;
  honors: string[];
  relevant_coursework: string[];
  description: string;
}

export interface SkillFormData {
  category: string;
  skill_name: string;
  proficiency_level: string;
}

export interface ProjectFormData {
  project_name: string;
  description: string;
  role: string;
  start_date: string;
  end_date: string;
  is_ongoing: boolean;
  technologies: string[];
  project_url: string;
  github_url: string;
  highlights: string[];
}

export interface CertificationFormData {
  certification_name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string;
  credential_id: string;
  credential_url: string;
  description: string;
}

export interface AwardFormData {
  award_name: string;
  issuing_organization: string;
  date_received: string;
  description: string;
}

export interface LanguageFormData {
  language_name: string;
  proficiency_level: string;
}

// Proficiency level options
export const SKILL_PROFICIENCY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
] as const;

export const LANGUAGE_PROFICIENCY_LEVELS = [
  'Native',
  'Fluent',
  'Professional',
  'Intermediate',
  'Basic',
] as const;

// Skill categories
export const SKILL_CATEGORIES = [
  'Technical Skills',
  'Programming Languages',
  'Frameworks & Libraries',
  'Tools & Platforms',
  'Soft Skills',
  'Languages',
  'Other',
] as const;

// Template options
export const RESUME_TEMPLATES = [
  'default',
  'modern',
  'classic',
  'minimal',
  'professional',
] as const;

export type SkillProficiencyLevel = typeof SKILL_PROFICIENCY_LEVELS[number];
export type LanguageProficiencyLevel = typeof LANGUAGE_PROFICIENCY_LEVELS[number];
export type SkillCategory = typeof SKILL_CATEGORIES[number];
export type ResumeTemplate = typeof RESUME_TEMPLATES[number];


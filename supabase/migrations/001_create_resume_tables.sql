-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create resumes table (main table)
CREATE TABLE public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    website VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    professional_summary TEXT,
    
    -- Metadata
    is_public BOOLEAN DEFAULT false,
    template_name VARCHAR(100) DEFAULT 'default',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT resumes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create work_experiences table
CREATE TABLE public.work_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    achievements TEXT[], -- Array of achievement strings
    technologies TEXT[], -- Array of technologies used
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT work_experiences_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE
);

-- Create education table
CREATE TABLE public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    gpa VARCHAR(20),
    honors TEXT[],
    relevant_coursework TEXT[],
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT education_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE
);

-- Create skills table
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- e.g., "Technical Skills", "Languages", "Soft Skills"
    skill_name VARCHAR(255) NOT NULL,
    proficiency_level VARCHAR(50), -- e.g., "Beginner", "Intermediate", "Advanced", "Expert"
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT skills_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    role VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_ongoing BOOLEAN DEFAULT false,
    technologies TEXT[],
    project_url VARCHAR(255),
    github_url VARCHAR(255),
    highlights TEXT[],
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT projects_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE
);

-- Create certifications table
CREATE TABLE public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(255),
    credential_url VARCHAR(255),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT certifications_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE
);

-- Create awards table
CREATE TABLE public.awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    award_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    date_received DATE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT awards_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE
);

-- Create languages table
CREATE TABLE public.languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    language_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50) NOT NULL, -- e.g., "Native", "Fluent", "Professional", "Intermediate", "Basic"
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT languages_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX idx_work_experiences_resume_id ON public.work_experiences(resume_id);
CREATE INDEX idx_education_resume_id ON public.education(resume_id);
CREATE INDEX idx_skills_resume_id ON public.skills(resume_id);
CREATE INDEX idx_projects_resume_id ON public.projects(resume_id);
CREATE INDEX idx_certifications_resume_id ON public.certifications(resume_id);
CREATE INDEX idx_awards_resume_id ON public.awards(resume_id);
CREATE INDEX idx_languages_resume_id ON public.languages(resume_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_experiences_updated_at BEFORE UPDATE ON public.work_experiences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON public.education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resumes table
CREATE POLICY "Users can view their own resumes"
    ON public.resumes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
    ON public.resumes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
    ON public.resumes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
    ON public.resumes FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for work_experiences table
CREATE POLICY "Users can view work experiences of their resumes"
    ON public.work_experiences FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = work_experiences.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert work experiences to their resumes"
    ON public.work_experiences FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = work_experiences.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can update work experiences of their resumes"
    ON public.work_experiences FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = work_experiences.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete work experiences of their resumes"
    ON public.work_experiences FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = work_experiences.resume_id
        AND resumes.user_id = auth.uid()
    ));

-- RLS Policies for education table
CREATE POLICY "Users can view education of their resumes"
    ON public.education FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = education.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert education to their resumes"
    ON public.education FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = education.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can update education of their resumes"
    ON public.education FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = education.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete education of their resumes"
    ON public.education FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = education.resume_id
        AND resumes.user_id = auth.uid()
    ));

-- RLS Policies for skills table
CREATE POLICY "Users can view skills of their resumes"
    ON public.skills FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = skills.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert skills to their resumes"
    ON public.skills FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = skills.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can update skills of their resumes"
    ON public.skills FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = skills.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete skills of their resumes"
    ON public.skills FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = skills.resume_id
        AND resumes.user_id = auth.uid()
    ));

-- RLS Policies for projects table
CREATE POLICY "Users can view projects of their resumes"
    ON public.projects FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = projects.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert projects to their resumes"
    ON public.projects FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = projects.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can update projects of their resumes"
    ON public.projects FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = projects.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete projects of their resumes"
    ON public.projects FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = projects.resume_id
        AND resumes.user_id = auth.uid()
    ));

-- RLS Policies for certifications table
CREATE POLICY "Users can view certifications of their resumes"
    ON public.certifications FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = certifications.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert certifications to their resumes"
    ON public.certifications FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = certifications.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can update certifications of their resumes"
    ON public.certifications FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = certifications.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete certifications of their resumes"
    ON public.certifications FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = certifications.resume_id
        AND resumes.user_id = auth.uid()
    ));

-- RLS Policies for awards table
CREATE POLICY "Users can view awards of their resumes"
    ON public.awards FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = awards.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert awards to their resumes"
    ON public.awards FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = awards.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can update awards of their resumes"
    ON public.awards FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = awards.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete awards of their resumes"
    ON public.awards FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = awards.resume_id
        AND resumes.user_id = auth.uid()
    ));

-- RLS Policies for languages table
CREATE POLICY "Users can view languages of their resumes"
    ON public.languages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = languages.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert languages to their resumes"
    ON public.languages FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = languages.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can update languages of their resumes"
    ON public.languages FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = languages.resume_id
        AND resumes.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete languages of their resumes"
    ON public.languages FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.resumes
        WHERE resumes.id = languages.resume_id
        AND resumes.user_id = auth.uid()
    ));


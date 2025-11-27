"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkExperienceForm } from "@/components/resume/work-experience-form";
import { EducationForm } from "@/components/resume/education-form";
import { SkillsForm } from "@/components/resume/skills-form";
import { TechnicalSkillsGroupForm } from "@/components/resume/technical-skills-group-form";
import { ProjectsForm } from "@/components/resume/projects-form";
import { CertificationsForm } from "@/components/resume/certifications-form";
import { LanguagesForm } from "@/components/resume/languages-form";
import { SoftSkillsForm } from "@/components/resume/soft-skills-form";
import { Plus, Save, Loader2, ArrowLeft } from "lucide-react";
import { getResumeWithDetailsAction, updateResumeAction } from "../../actions";
import type {
    ResumeFormData,
    WorkExperienceFormData,
    EducationFormData,
    SkillFormData,
    ProjectFormData,
    CertificationFormData,
    LanguageFormData
} from "@/types/resume-form";
import Link from "next/link";

const emptyWorkExperience: WorkExperienceFormData = {
    company_name: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    achievements: [],
    technologies: [],
};

const emptyEducation: EducationFormData = {
    institution_name: "",
    degree: "",
    field_of_study: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    gpa: "",
    honors: [],
    relevant_coursework: [],
    description: "",
};

const emptySkill: SkillFormData = {
    skill_name: "",
    category: "Technical Skills",
    proficiency_level: "",
};

const emptySoftSkill: SkillFormData = {
    skill_name: "",
    category: "Soft Skills",
    proficiency_level: "",
};

const emptyProject: ProjectFormData = {
    project_name: "",
    role: "",
    start_date: "",
    end_date: "",
    description: "",
    project_url: "",
    github_url: "",
    technologies: [],
    highlights: [],
    is_ongoing: false,
};

const emptyCertification: CertificationFormData = {
    certification_name: "",
    issuing_organization: "",
    issue_date: "",
    expiry_date: "",
    credential_id: "",
    credential_url: "",
    description: "",
};

const emptyLanguage: LanguageFormData = {
    language_name: "",
    proficiency_level: "Intermediate",
};

export default function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ResumeFormData>({
        title: "",
        full_name: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin_url: "",
        github_url: "",
        professional_summary: "",
        work_experiences: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        awards: [],
        languages: [],
        is_public: false,
        template_name: "default",
    });

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const result = await getResumeWithDetailsAction(id);
                if (result.error || !result.resume) {
                    setError(result.error || "Resume not found");
                } else {
                    const resume = result.resume;
                    setFormData({
                        title: resume.title,
                        full_name: resume.full_name,
                        email: resume.email,
                        phone: resume.phone || "",
                        location: resume.location || "",
                        website: resume.website || "",
                        linkedin_url: resume.linkedin_url || "",
                        github_url: resume.github_url || "",
                        professional_summary: resume.professional_summary || "",
                        work_experiences: resume.work_experiences.map(exp => ({
                            ...exp,
                            start_date: exp.start_date,
                            end_date: exp.end_date || "",
                            description: exp.description || "",
                            location: exp.location || "",
                            achievements: exp.achievements || [],
                            technologies: exp.technologies || [],
                        })),
                        education: resume.education.map(edu => ({
                            ...edu,
                            start_date: edu.start_date || "",
                            end_date: edu.end_date || "",
                            field_of_study: edu.field_of_study || "",
                            location: edu.location || "",
                            gpa: edu.gpa || "",
                            description: edu.description || "",
                            honors: edu.honors || [],
                            relevant_coursework: edu.relevant_coursework || [],
                        })),
                        skills: resume.skills.map(skill => ({
                            ...skill,
                            category: skill.category || "Other",
                            proficiency_level: skill.proficiency_level || "Intermediate",
                        })),
                        projects: resume.projects.map(proj => ({
                            ...proj,
                            start_date: proj.start_date || "",
                            end_date: proj.end_date || "",
                            role: proj.role || "",
                            project_url: proj.project_url || "",
                            github_url: proj.github_url || "",
                            technologies: proj.technologies || [],
                            highlights: proj.highlights || [],
                            is_ongoing: proj.is_ongoing || false,
                        })),
                        certifications: resume.certifications.map(cert => ({
                            ...cert,
                            issue_date: cert.issue_date || "",
                            expiry_date: cert.expiry_date || "",
                            credential_id: cert.credential_id || "",
                            credential_url: cert.credential_url || "",
                            description: cert.description || "",
                        })),
                        awards: resume.awards.map(award => ({
                            ...award,
                            date_received: award.date_received || "",
                            description: award.description || "",
                        })),
                        languages: resume.languages,
                        is_public: resume.is_public,
                        template_name: resume.template_name,
                    });
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load resume");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    const updateField = (field: keyof ResumeFormData, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Work Experience Handlers
    const addWorkExperience = () => {
        setFormData({
            ...formData,
            work_experiences: [...formData.work_experiences, { ...emptyWorkExperience }],
        });
    };

    const updateWorkExperience = (index: number, experience: WorkExperienceFormData) => {
        const updated = [...formData.work_experiences];
        updated[index] = experience;
        setFormData({ ...formData, work_experiences: updated });
    };

    const removeWorkExperience = (index: number) => {
        setFormData({
            ...formData,
            work_experiences: formData.work_experiences.filter((_, i) => i !== index),
        });
    };

    // Education Handlers
    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { ...emptyEducation }],
        });
    };

    const updateEducation = (index: number, education: EducationFormData) => {
        const updated = [...formData.education];
        updated[index] = education;
        setFormData({ ...formData, education: updated });
    };

    const removeEducation = (index: number) => {
        setFormData({
            ...formData,
            education: formData.education.filter((_, i) => i !== index),
        });
    };

    // Technical Skills Group Handlers
    const getTechnicalGroups = () => {
        const groups: { category: string; skills: string[] }[] = [];
        const technicalSkills = formData.skills.filter(s => s.category !== 'Soft Skills');

        // Group by category
        const categoryMap = new Map<string, string[]>();

        technicalSkills.forEach(skill => {
            const current = categoryMap.get(skill.category) || [];
            if (skill.skill_name) {
                current.push(skill.skill_name);
            }
            categoryMap.set(skill.category, current);
        });

        categoryMap.forEach((skills, category) => {
            groups.push({ category, skills });
        });

        return groups;
    };

    const addTechnicalGroup = () => {
        setFormData({
            ...formData,
            skills: [...formData.skills, { ...emptySkill, category: "New Category", skill_name: "" }],
        });
    };

    const updateTechnicalGroup = (oldCategory: string, newCategory: string, newSkills: string[]) => {
        // Remove all skills of the old category
        const otherSkills = formData.skills.filter(s => s.category !== oldCategory);

        // Create new skill entries
        const newSkillEntries: SkillFormData[] = newSkills.length > 0
            ? newSkills.map(name => ({
                category: newCategory,
                skill_name: name,
                proficiency_level: ""
            }))
            : [{ category: newCategory, skill_name: "", proficiency_level: "" }]; // Keep category alive if no skills

        setFormData({
            ...formData,
            skills: [...otherSkills, ...newSkillEntries]
        });
    };

    const removeTechnicalGroup = (categoryToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s.category !== categoryToRemove)
        });
    };

    // Soft Skills Handlers
    const addSoftSkill = () => {
        setFormData({
            ...formData,
            skills: [...formData.skills, { ...emptySoftSkill }],
        });
    };

    // Projects Handlers
    const addProject = () => {
        setFormData({
            ...formData,
            projects: [...formData.projects, { ...emptyProject }],
        });
    };

    const updateProject = (index: number, project: ProjectFormData) => {
        const updated = [...formData.projects];
        updated[index] = project;
        setFormData({ ...formData, projects: updated });
    };

    const removeProject = (index: number) => {
        setFormData({
            ...formData,
            projects: formData.projects.filter((_, i) => i !== index),
        });
    };

    // Certifications Handlers
    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, { ...emptyCertification }],
        });
    };

    const updateCertification = (index: number, certification: CertificationFormData) => {
        const updated = [...formData.certifications];
        updated[index] = certification;
        setFormData({ ...formData, certifications: updated });
    };

    const removeCertification = (index: number) => {
        setFormData({
            ...formData,
            certifications: formData.certifications.filter((_, i) => i !== index),
        });
    };

    // Languages Handlers
    const addLanguage = () => {
        setFormData({
            ...formData,
            languages: [...formData.languages, { ...emptyLanguage }],
        });
    };

    const updateLanguage = (index: number, language: LanguageFormData) => {
        const updated = [...formData.languages];
        updated[index] = language;
        setFormData({ ...formData, languages: updated });
    };

    const removeLanguage = (index: number) => {
        setFormData({
            ...formData,
            languages: formData.languages.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const result = await updateResumeAction(id, formData);

            if (result.error) {
                setError(result.error);
            } else if (result.success) {
                router.push(`/resumes/${id}`);
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/resumes">
                            <Button>Back to Resumes</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href={`/resumes/${id}`}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold">Edit Resume</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Update your resume information
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>General details about your resume</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Resume Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => updateField("title", e.target.value)}
                                    placeholder="e.g., Software Engineer Resume"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Your contact details and professional links</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name *</Label>
                                    <Input
                                        id="full_name"
                                        value={formData.full_name}
                                        onChange={(e) => updateField("full_name", e.target.value)}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => updateField("location", e.target.value)}
                                        placeholder="San Francisco, CA"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => updateField("website", e.target.value)}
                                        placeholder="https://johndoe.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                    <Input
                                        id="linkedin_url"
                                        type="url"
                                        value={formData.linkedin_url}
                                        onChange={(e) => updateField("linkedin_url", e.target.value)}
                                        placeholder="https://linkedin.com/in/johndoe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="github_url">GitHub URL</Label>
                                <Input
                                    id="github_url"
                                    type="url"
                                    value={formData.github_url}
                                    onChange={(e) => updateField("github_url", e.target.value)}
                                    placeholder="https://github.com/johndoe"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="professional_summary">Professional Summary</Label>
                                <Textarea
                                    id="professional_summary"
                                    value={formData.professional_summary}
                                    onChange={(e) => updateField("professional_summary", e.target.value)}
                                    placeholder="A brief summary of your professional background and career objectives..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work Experience Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Work Experience</CardTitle>
                                    <CardDescription>Add your professional work history</CardDescription>
                                </div>
                                <Button type="button" onClick={addWorkExperience} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Experience
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.work_experiences.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No work experience added yet. Click "Add Experience" to get started.
                                </p>
                            ) : (
                                formData.work_experiences.map((exp, index) => (
                                    <WorkExperienceForm
                                        key={index}
                                        experience={exp}
                                        onChange={(updated) => updateWorkExperience(index, updated)}
                                        onRemove={() => removeWorkExperience(index)}
                                        index={index}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Education Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Education</CardTitle>
                                    <CardDescription>Add your educational background</CardDescription>
                                </div>
                                <Button type="button" onClick={addEducation} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Education
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.education.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No education added yet. Click "Add Education" to get started.
                                </p>
                            ) : (
                                formData.education.map((edu, index) => (
                                    <EducationForm
                                        key={index}
                                        education={edu}
                                        onChange={(updated) => updateEducation(index, updated)}
                                        onRemove={() => removeEducation(index)}
                                        index={index}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Technical Skills Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Technical Skills</CardTitle>
                                    <CardDescription>Group your technical skills by category (e.g. Languages, Frameworks)</CardDescription>
                                </div>
                                <Button type="button" onClick={addTechnicalGroup} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Category
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {getTechnicalGroups().length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No technical skill categories added yet. Click "Add Category" to get started.
                                </p>
                            ) : (
                                getTechnicalGroups().map((group, index) => (
                                    <TechnicalSkillsGroupForm
                                        key={index}
                                        category={group.category}
                                        skills={group.skills}
                                        onChange={(newCat, newSkills) => updateTechnicalGroup(group.category, newCat, newSkills)}
                                        onRemove={() => removeTechnicalGroup(group.category)}
                                        index={index}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Soft Skills Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Soft Skills</CardTitle>
                                    <CardDescription>Add your soft skills (Communication, Leadership, etc.)</CardDescription>
                                </div>
                                <Button type="button" onClick={addSoftSkill} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Soft Skill
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.skills.filter(s => s.category === 'Soft Skills').length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No soft skills added yet. Click "Add Soft Skill" to get started.
                                </p>
                            ) : (
                                formData.skills.map((skill, index) => {
                                    if (skill.category !== 'Soft Skills') return null;
                                    return (
                                        <SoftSkillsForm
                                            key={index}
                                            skill={skill}
                                            onChange={(updated) => {
                                                const updatedSkills = [...formData.skills];
                                                updatedSkills[index] = updated;
                                                setFormData({ ...formData, skills: updatedSkills });
                                            }}
                                            onRemove={() => {
                                                setFormData({
                                                    ...formData,
                                                    skills: formData.skills.filter((_, i) => i !== index),
                                                });
                                            }}
                                            index={index}
                                        />
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>

                    {/* Projects Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Projects</CardTitle>
                                    <CardDescription>Add your personal or professional projects</CardDescription>
                                </div>
                                <Button type="button" onClick={addProject} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Project
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.projects.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No projects added yet. Click "Add Project" to get started.
                                </p>
                            ) : (
                                formData.projects.map((project, index) => (
                                    <ProjectsForm
                                        key={index}
                                        project={project}
                                        onChange={(updated) => updateProject(index, updated)}
                                        onRemove={() => removeProject(index)}
                                        index={index}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Certifications Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Certifications</CardTitle>
                                    <CardDescription>Add your certifications and licenses</CardDescription>
                                </div>
                                <Button type="button" onClick={addCertification} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Certification
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.certifications.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No certifications added yet. Click "Add Certification" to get started.
                                </p>
                            ) : (
                                formData.certifications.map((cert, index) => (
                                    <CertificationsForm
                                        key={index}
                                        certification={cert}
                                        onChange={(updated) => updateCertification(index, updated)}
                                        onRemove={() => removeCertification(index)}
                                        index={index}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Languages Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Languages</CardTitle>
                                    <CardDescription>Add languages you speak</CardDescription>
                                </div>
                                <Button type="button" onClick={addLanguage} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Language
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.languages.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No languages added yet. Click "Add Language" to get started.
                                </p>
                            ) : (
                                formData.languages.map((lang, index) => (
                                    <LanguagesForm
                                        key={index}
                                        language={lang}
                                        onChange={(updated) => updateLanguage(index, updated)}
                                        onRemove={() => removeLanguage(index)}
                                        index={index}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkExperienceForm } from "@/components/resume/work-experience-form";
import { EducationForm } from "@/components/resume/education-form";
import { Plus, Save, Loader2 } from "lucide-react";
import { createResumeAction } from "../actions";
import type { ResumeFormData, WorkExperienceFormData, EducationFormData, SkillFormData } from "@/types/resume-form";

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
  category: "Technical Skills",
  skill_name: "",
  proficiency_level: "Intermediate",
};

export default function NewResumePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  const updateField = (field: keyof ResumeFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await createResumeAction(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success && result.resumeId) {
        router.push(`/resumes/${result.resumeId}`);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create New Resume</h1>
            <p className="text-muted-foreground mt-1">
              Fill in your information to create a professional resume
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

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Resume
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


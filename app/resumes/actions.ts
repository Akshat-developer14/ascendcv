"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { ResumeFormData } from "@/types/resume-form";
import type { ResumeWithDetails } from "@/types/database";

/**
 * Create a new resume with all related data
 */
export async function createResumeAction(formData: ResumeFormData) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to create a resume" };
  }

  try {
    // 1. Create the main resume record
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: formData.title,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        location: formData.location || null,
        website: formData.website || null,
        linkedin_url: formData.linkedin_url || null,
        github_url: formData.github_url || null,
        professional_summary: formData.professional_summary || null,
        is_public: formData.is_public,
        template_name: formData.template_name,
      })
      .select()
      .single();

    if (resumeError || !resume) {
      console.error("Resume creation error:", resumeError);
      return { error: "Failed to create resume" };
    }

    // 2. Insert work experiences
    if (formData.work_experiences.length > 0) {
      const workExperiences = formData.work_experiences.map((exp, index) => ({
        resume_id: resume.id,
        company_name: exp.company_name,
        position: exp.position,
        location: exp.location || null,
        start_date: exp.start_date,
        end_date: exp.is_current ? null : exp.end_date || null,
        is_current: exp.is_current,
        description: exp.description || null,
        achievements: exp.achievements.filter(a => a.trim() !== ''),
        technologies: exp.technologies.filter(t => t.trim() !== ''),
        display_order: index,
      }));

      const { error: workError } = await supabase
        .from("work_experiences")
        .insert(workExperiences);

      if (workError) {
        console.error("Work experiences error:", workError);
        // Continue anyway - partial success is better than complete failure
      }
    }

    // 3. Insert education
    if (formData.education.length > 0) {
      const education = formData.education.map((edu, index) => ({
        resume_id: resume.id,
        institution_name: edu.institution_name,
        degree: edu.degree,
        field_of_study: edu.field_of_study || null,
        location: edu.location || null,
        start_date: edu.start_date || null,
        end_date: edu.is_current ? null : edu.end_date || null,
        is_current: edu.is_current,
        gpa: edu.gpa || null,
        honors: edu.honors.filter(h => h.trim() !== ''),
        relevant_coursework: edu.relevant_coursework.filter(c => c.trim() !== ''),
        description: edu.description || null,
        display_order: index,
      }));

      const { error: eduError } = await supabase
        .from("education")
        .insert(education);

      if (eduError) {
        console.error("Education error:", eduError);
      }
    }

    // 4. Insert skills
    if (formData.skills.length > 0) {
      const skills = formData.skills.map((skill, index) => ({
        resume_id: resume.id,
        category: skill.category,
        skill_name: skill.skill_name,
        proficiency_level: skill.proficiency_level || null,
        display_order: index,
      }));

      const { error: skillsError } = await supabase
        .from("skills")
        .insert(skills);

      if (skillsError) {
        console.error("Skills error:", skillsError);
      }
    }

    // 5. Insert projects
    if (formData.projects.length > 0) {
      const projects = formData.projects.map((proj, index) => ({
        resume_id: resume.id,
        project_name: proj.project_name,
        description: proj.description,
        role: proj.role || null,
        start_date: proj.start_date || null,
        end_date: proj.is_ongoing ? null : proj.end_date || null,
        is_ongoing: proj.is_ongoing,
        technologies: proj.technologies.filter(t => t.trim() !== ''),
        project_url: proj.project_url || null,
        github_url: proj.github_url || null,
        highlights: proj.highlights.filter(h => h.trim() !== ''),
        display_order: index,
      }));

      const { error: projError } = await supabase
        .from("projects")
        .insert(projects);

      if (projError) {
        console.error("Projects error:", projError);
      }
    }

    // 6. Insert certifications
    if (formData.certifications.length > 0) {
      const certifications = formData.certifications.map((cert, index) => ({
        resume_id: resume.id,
        certification_name: cert.certification_name,
        issuing_organization: cert.issuing_organization,
        issue_date: cert.issue_date || null,
        expiry_date: cert.expiry_date || null,
        credential_id: cert.credential_id || null,
        credential_url: cert.credential_url || null,
        description: cert.description || null,
        display_order: index,
      }));

      const { error: certError } = await supabase
        .from("certifications")
        .insert(certifications);

      if (certError) {
        console.error("Certifications error:", certError);
      }
    }

    // 7. Insert awards
    if (formData.awards.length > 0) {
      const awards = formData.awards.map((award, index) => ({
        resume_id: resume.id,
        award_name: award.award_name,
        issuing_organization: award.issuing_organization,
        date_received: award.date_received || null,
        description: award.description || null,
        display_order: index,
      }));

      const { error: awardsError } = await supabase
        .from("awards")
        .insert(awards);

      if (awardsError) {
        console.error("Awards error:", awardsError);
      }
    }

    // 8. Insert languages
    if (formData.languages.length > 0) {
      const languages = formData.languages.map((lang, index) => ({
        resume_id: resume.id,
        language_name: lang.language_name,
        proficiency_level: lang.proficiency_level,
        display_order: index,
      }));

      const { error: langError } = await supabase
        .from("languages")
        .insert(languages);

      if (langError) {
        console.error("Languages error:", langError);
      }
    }

    return { success: true, resumeId: resume.id };
  } catch (error) {
    console.error("Unexpected error creating resume:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get all resumes for the current user
 */
export async function getUserResumesAction() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to view resumes" };
  }

  const { data: resumes, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching resumes:", error);
    return { error: "Failed to fetch resumes" };
  }

  return { resumes };
}

/**
 * Get a single resume with all related data
 */
export async function getResumeWithDetailsAction(resumeId: string): Promise<{ resume?: ResumeWithDetails; error?: string }> {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to view resumes" };
  }

  // Fetch resume
  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (resumeError || !resume) {
    return { error: "Resume not found" };
  }

  // Fetch all related data in parallel
  const [
    { data: work_experiences },
    { data: education },
    { data: skills },
    { data: projects },
    { data: certifications },
    { data: awards },
    { data: languages },
  ] = await Promise.all([
    supabase.from("work_experiences").select("*").eq("resume_id", resumeId).order("display_order"),
    supabase.from("education").select("*").eq("resume_id", resumeId).order("display_order"),
    supabase.from("skills").select("*").eq("resume_id", resumeId).order("display_order"),
    supabase.from("projects").select("*").eq("resume_id", resumeId).order("display_order"),
    supabase.from("certifications").select("*").eq("resume_id", resumeId).order("display_order"),
    supabase.from("awards").select("*").eq("resume_id", resumeId).order("display_order"),
    supabase.from("languages").select("*").eq("resume_id", resumeId).order("display_order"),
  ]);

  const resumeWithDetails: ResumeWithDetails = {
    ...resume,
    work_experiences: work_experiences || [],
    education: education || [],
    skills: skills || [],
    projects: projects || [],
    certifications: certifications || [],
    awards: awards || [],
    languages: languages || [],
  };

  return { resume: resumeWithDetails };
}

/**
 * Delete a resume
 */
export async function deleteResumeAction(resumeId: string) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to delete resumes" };
  }

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting resume:", error);
    return { error: "Failed to delete resume" };
  }

  return { success: true };
}

/**
 * Update an existing resume
 */
export async function updateResumeAction(resumeId: string, formData: ResumeFormData) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to update a resume" };
  }

  try {
    // 1. Update the main resume record
    const { error: resumeError } = await supabase
      .from("resumes")
      .update({
        title: formData.title,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        location: formData.location || null,
        website: formData.website || null,
        linkedin_url: formData.linkedin_url || null,
        github_url: formData.github_url || null,
        professional_summary: formData.professional_summary || null,
        is_public: formData.is_public,
        template_name: formData.template_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resumeId)
      .eq("user_id", user.id);

    if (resumeError) {
      console.error("Resume update error:", resumeError);
      return { error: "Failed to update resume" };
    }

    // 2. Delete existing related records to replace them
    // This is a simplified approach; for production with many relations, 
    // you might want to diff and update/insert/delete individually.
    await Promise.all([
      supabase.from("work_experiences").delete().eq("resume_id", resumeId),
      supabase.from("education").delete().eq("resume_id", resumeId),
      supabase.from("skills").delete().eq("resume_id", resumeId),
      supabase.from("projects").delete().eq("resume_id", resumeId),
      supabase.from("certifications").delete().eq("resume_id", resumeId),
      supabase.from("awards").delete().eq("resume_id", resumeId),
      supabase.from("languages").delete().eq("resume_id", resumeId),
    ]);

    // 3. Re-insert work experiences
    if (formData.work_experiences.length > 0) {
      const workExperiences = formData.work_experiences.map((exp, index) => ({
        resume_id: resumeId,
        company_name: exp.company_name,
        position: exp.position,
        location: exp.location || null,
        start_date: exp.start_date,
        end_date: exp.is_current ? null : exp.end_date || null,
        is_current: exp.is_current,
        description: exp.description || null,
        achievements: exp.achievements.filter(a => a.trim() !== ''),
        technologies: exp.technologies.filter(t => t.trim() !== ''),
        display_order: index,
      }));

      await supabase.from("work_experiences").insert(workExperiences);
    }

    // 4. Re-insert education
    if (formData.education.length > 0) {
      const education = formData.education.map((edu, index) => ({
        resume_id: resumeId,
        institution_name: edu.institution_name,
        degree: edu.degree,
        field_of_study: edu.field_of_study || null,
        location: edu.location || null,
        start_date: edu.start_date || null,
        end_date: edu.is_current ? null : edu.end_date || null,
        is_current: edu.is_current,
        gpa: edu.gpa || null,
        honors: edu.honors.filter(h => h.trim() !== ''),
        relevant_coursework: edu.relevant_coursework.filter(c => c.trim() !== ''),
        description: edu.description || null,
        display_order: index,
      }));

      await supabase.from("education").insert(education);
    }

    // 5. Re-insert skills
    if (formData.skills.length > 0) {
      const skills = formData.skills.map((skill, index) => ({
        resume_id: resumeId,
        category: skill.category,
        skill_name: skill.skill_name,
        proficiency_level: skill.proficiency_level || null,
        display_order: index,
      }));

      await supabase.from("skills").insert(skills);
    }

    // 6. Re-insert projects
    if (formData.projects.length > 0) {
      const projects = formData.projects.map((proj, index) => ({
        resume_id: resumeId,
        project_name: proj.project_name,
        description: proj.description,
        role: proj.role || null,
        start_date: proj.start_date || null,
        end_date: proj.is_ongoing ? null : proj.end_date || null,
        is_ongoing: proj.is_ongoing,
        technologies: proj.technologies.filter(t => t.trim() !== ''),
        project_url: proj.project_url || null,
        github_url: proj.github_url || null,
        highlights: proj.highlights.filter(h => h.trim() !== ''),
        display_order: index,
      }));

      await supabase.from("projects").insert(projects);
    }

    // 7. Re-insert certifications
    if (formData.certifications.length > 0) {
      const certifications = formData.certifications.map((cert, index) => ({
        resume_id: resumeId,
        certification_name: cert.certification_name,
        issuing_organization: cert.issuing_organization,
        issue_date: cert.issue_date || null,
        expiry_date: cert.expiry_date || null,
        credential_id: cert.credential_id || null,
        credential_url: cert.credential_url || null,
        description: cert.description || null,
        display_order: index,
      }));

      await supabase.from("certifications").insert(certifications);
    }

    // 8. Re-insert awards
    if (formData.awards.length > 0) {
      const awards = formData.awards.map((award, index) => ({
        resume_id: resumeId,
        award_name: award.award_name,
        issuing_organization: award.issuing_organization,
        date_received: award.date_received || null,
        description: award.description || null,
        display_order: index,
      }));

      await supabase.from("awards").insert(awards);
    }

    // 9. Re-insert languages
    if (formData.languages.length > 0) {
      const languages = formData.languages.map((lang, index) => ({
        resume_id: resumeId,
        language_name: lang.language_name,
        proficiency_level: lang.proficiency_level,
        display_order: index,
      }));

      await supabase.from("languages").insert(languages);
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating resume:", error);
    return { error: "An unexpected error occurred" };
  }
}

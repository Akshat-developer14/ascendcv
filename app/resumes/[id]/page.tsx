import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";
import { getResumeWithDetailsAction } from "../actions";
import { DownloadButton } from "@/components/resume/download-button";

export default async function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const result = await getResumeWithDetailsAction(id);

  if (result.error || !result.resume) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{result.error || "Resume not found"}</p>
            <Link href="/resumes">
              <Button className="mt-4">Back to Resumes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resume = result.resume;

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      {/* Control Bar - Hidden in Print */}
      <div className="max-w-[210mm] mx-auto mb-6 px-4 print:hidden flex items-center justify-between">
        <Link href="/resumes">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resumes
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/resumes/${id}/edit`}>
            <Button variant="outline">Edit Resume</Button>
          </Link>
          <DownloadButton targetId="resume-preview" fileName={resume.full_name || "resume"} />
        </div>
      </div>

      {/* A4 Resume Container */}
      <div
        id="resume-preview"
        className="mx-auto bg-white shadow-lg print:shadow-none max-w-[210mm] min-h-[297mm] p-[20mm] text-slate-900"
        style={{ fontFamily: 'serif' }} // Using serif for a more classic resume look, or could use sans
      >
        {/* Header Section */}
        <header className="border-b-2 border-slate-800 pb-6 mb-6">
          <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900 mb-2">
            {resume.full_name}
          </h1>
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-600">
            {resume.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <a href={`mailto:${resume.email}`} className="hover:text-slate-900">{resume.email}</a>
              </div>
            )}
            {resume.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{resume.phone}</span>
              </div>
            )}
            {resume.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{resume.location}</span>
              </div>
            )}
            {resume.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <a href={resume.website} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
                  {(() => {
                    try {
                      return new URL(resume.website).hostname.replace(/^www\./, '');
                    } catch {
                      return resume.website;
                    }
                  })()}
                </a>
              </div>
            )}
            {resume.linkedin_url && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-3 w-3" />
                <a href={resume.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
                  {(() => {
                    try {
                      return new URL(resume.linkedin_url).hostname.replace(/^www\./, '');
                    } catch {
                      return "LinkedIn";
                    }
                  })()}
                </a>
              </div>
            )}
            {resume.github_url && (
              <div className="flex items-center gap-1">
                <Github className="h-3 w-3" />
                <a href={resume.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
                  {(() => {
                    try {
                      return new URL(resume.github_url).hostname.replace(/^www\./, '');
                    } catch {
                      return "GitHub";
                    }
                  })()}
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {resume.professional_summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              {resume.professional_summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {resume.work_experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-4 pb-1">
              Work Experience
            </h2>
            <div className="space-y-5">
              {resume.work_experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-sm text-slate-600 whitespace-nowrap">
                      {new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} –{" "}
                      {exp.is_current ? "Present" : new Date(exp.end_date!).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">{exp.company_name}</span>
                    {exp.location && <span className="text-xs text-slate-500">{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-slate-700 mb-2">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-slate-700 leading-snug pl-1">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-2 text-xs text-slate-500">
                      <span className="font-semibold">Technologies:</span> {exp.technologies.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-4 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">{edu.institution_name}</h3>
                    <span className="text-sm text-slate-600 whitespace-nowrap">
                      {edu.start_date && new Date(edu.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} –{" "}
                      {edu.is_current ? "Present" : edu.end_date ? new Date(edu.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-700">
                      <span className="font-semibold">{edu.degree}</span>
                      {edu.field_of_study && <span> in {edu.field_of_study}</span>}
                    </div>
                    {edu.location && <span className="text-xs text-slate-500">{edu.location}</span>}
                  </div>
                  {edu.gpa && <p className="text-sm text-slate-600 mt-1">GPA: {edu.gpa}</p>}
                  {edu.honors && edu.honors.length > 0 && (
                    <div className="mt-1 text-sm text-slate-600">
                      <span className="font-semibold">Honors:</span> {edu.honors.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Skills
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(
                resume.skills.reduce((acc, skill) => {
                  if (!skill.skill_name) return acc;
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill.skill_name);
                  return acc;
                }, {} as Record<string, string[]>)
              ).map(([category, skills]) => (
                <div key={category} className="text-sm">
                  <h3 className="font-bold text-slate-900 mb-1">{category}</h3>
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {skills.map((skill, idx) => (
                      <li key={idx} className="text-slate-700">{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-4 pb-1">
              Projects
            </h2>
            <div className="space-y-4">
              {resume.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{project.project_name}</h3>
                      <div className="flex gap-2 text-xs">
                        {project.project_url && (
                          <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                            Live <ExternalLink className="h-3 w-3 ml-0.5" />
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                            Code <Github className="h-3 w-3 ml-0.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    {(project.start_date || project.end_date) && (
                      <span className="text-sm text-slate-600 whitespace-nowrap">
                        {project.start_date && new Date(project.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        {project.end_date && ` – ${new Date(project.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 mb-1">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold">Tech Stack:</span> {project.technologies.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Certifications
            </h2>
            <div className="space-y-2">
              {resume.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline text-sm">
                  <div>
                    <span className="font-bold text-slate-900">{cert.certification_name}</span>
                    <span className="text-slate-700"> — {cert.issuing_organization}</span>
                  </div>
                  {cert.issue_date && (
                    <span className="text-slate-600">
                      {new Date(cert.issue_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {resume.languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Languages
            </h2>
            <div className="text-sm text-slate-700">
              {resume.languages.map((lang, idx) => (
                <span key={lang.id}>
                  <span className="font-semibold">{lang.language_name}</span> ({lang.proficiency_level})
                  {idx < resume.languages.length - 1 && ", "}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


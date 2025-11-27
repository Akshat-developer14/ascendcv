"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrayInput } from "./array-input";
import { X } from "lucide-react";
import type { ProjectFormData } from "@/types/resume-form";

interface ProjectsFormProps {
    project: ProjectFormData;
    onChange: (project: ProjectFormData) => void;
    onRemove: () => void;
    index: number;
}

export function ProjectsForm({
    project,
    onChange,
    onRemove,
    index,
}: ProjectsFormProps) {
    const updateField = (field: keyof ProjectFormData, value: any) => {
        onChange({ ...project, [field]: value });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Project #{index + 1}</CardTitle>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="h-8 w-8"
                >
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`project-name-${index}`}>Project Name *</Label>
                        <Input
                            id={`project-name-${index}`}
                            value={project.project_name}
                            onChange={(e) => updateField("project_name", e.target.value)}
                            placeholder="E-commerce Platform"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`role-${index}`}>Role</Label>
                        <Input
                            id={`role-${index}`}
                            value={project.role}
                            onChange={(e) => updateField("role", e.target.value)}
                            placeholder="Lead Developer"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`project-url-${index}`}>Project URL</Label>
                        <Input
                            id={`project-url-${index}`}
                            type="url"
                            value={project.project_url}
                            onChange={(e) => updateField("project_url", e.target.value)}
                            placeholder="https://myproject.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`github-url-${index}`}>GitHub URL</Label>
                        <Input
                            id={`github-url-${index}`}
                            type="url"
                            value={project.github_url}
                            onChange={(e) => updateField("github_url", e.target.value)}
                            placeholder="https://github.com/user/repo"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                        <Input
                            id={`start-date-${index}`}
                            type="date"
                            value={project.start_date}
                            onChange={(e) => updateField("start_date", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`end-date-${index}`}>End Date</Label>
                        <Input
                            id={`end-date-${index}`}
                            type="date"
                            value={project.end_date}
                            onChange={(e) => updateField("end_date", e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                        id={`description-${index}`}
                        value={project.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="Describe the project and your contributions..."
                        rows={3}
                    />
                </div>

                <ArrayInput
                    label="Technologies Used"
                    placeholder="Add a technology"
                    values={project.technologies}
                    onChange={(values) => updateField("technologies", values)}
                    description="Tech stack used in this project"
                />

                <ArrayInput
                    label="Key Highlights"
                    placeholder="Add a highlight"
                    values={project.highlights}
                    onChange={(values) => updateField("highlights", values)}
                    description="Key features or achievements"
                />
            </CardContent>
        </Card>
    );
}

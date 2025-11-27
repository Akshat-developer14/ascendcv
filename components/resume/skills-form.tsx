"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { SkillFormData } from "@/types/resume-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SkillsFormProps {
    skill: SkillFormData;
    onChange: (skill: SkillFormData) => void;
    onRemove: () => void;
    index: number;
}

export function SkillsForm({
    skill,
    onChange,
    onRemove,
    index,
}: SkillsFormProps) {
    const updateField = (field: keyof SkillFormData, value: any) => {
        onChange({ ...skill, [field]: value });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Skill #{index + 1}</CardTitle>
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
                        <Label htmlFor={`skill-name-${index}`}>Skill Name *</Label>
                        <Input
                            id={`skill-name-${index}`}
                            value={skill.skill_name}
                            onChange={(e) => updateField("skill_name", e.target.value)}
                            placeholder="React"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`skill-category-${index}`}>Category</Label>
                        <Input
                            id={`skill-category-${index}`}
                            value={skill.category}
                            onChange={(e) => updateField("category", e.target.value)}
                            placeholder="Frontend, Backend, Tools..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`proficiency-${index}`}>Proficiency Level</Label>
                    <Select
                        value={skill.proficiency_level}
                        onValueChange={(value) => updateField("proficiency_level", value)}
                    >
                        <SelectTrigger id={`proficiency-${index}`}>
                            <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}

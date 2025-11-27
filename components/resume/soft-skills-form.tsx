"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { SkillFormData } from "@/types/resume-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SoftSkillsFormProps {
    skill: SkillFormData;
    onChange: (skill: SkillFormData) => void;
    onRemove: () => void;
    index: number;
}

export function SoftSkillsForm({
    skill,
    onChange,
    onRemove,
    index,
}: SoftSkillsFormProps) {
    const updateField = (field: keyof SkillFormData, value: any) => {
        onChange({ ...skill, [field]: value });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Soft Skill #{index + 1}</CardTitle>
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
                <div className="space-y-2">
                    <Label htmlFor={`soft-skill-name-${index}`}>Skill Name *</Label>
                    <Input
                        id={`soft-skill-name-${index}`}
                        value={skill.skill_name}
                        onChange={(e) => updateField("skill_name", e.target.value)}
                        placeholder="Communication, Leadership, etc."
                        required
                    />
                </div>
            </CardContent>
        </Card>
    );
}

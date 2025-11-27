"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

interface TechnicalSkillsGroupFormProps {
    category: string;
    skills: string[];
    onChange: (category: string, skills: string[]) => void;
    onRemove: () => void;
    index: number;
}

export function TechnicalSkillsGroupForm({
    category,
    skills,
    onChange,
    onRemove,
    index,
}: TechnicalSkillsGroupFormProps) {
    const [newSkill, setNewSkill] = useState("");
    const skillInputRef = useRef<HTMLInputElement>(null);

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            onChange(category, [...skills, newSkill.trim()]);
            setNewSkill("");
            // Keep focus on input for rapid entry
            skillInputRef.current?.focus();
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        onChange(category, skills.filter(s => s !== skillToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Skill Category #{index + 1}</CardTitle>
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
                    <Label htmlFor={`category-${index}`}>Category Name *</Label>
                    <Input
                        id={`category-${index}`}
                        value={category}
                        onChange={(e) => onChange(e.target.value, skills)}
                        placeholder="e.g. Programming Languages, Frameworks"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Skills List</Label>
                    <div className="flex gap-2">
                        <Input
                            ref={skillInputRef}
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a skill (e.g. Python)"
                        />
                        <Button type="button" onClick={handleAddSkill} size="sm">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {skills.map((skill, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-md text-sm"
                            >
                                <span>{skill}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="text-muted-foreground hover:text-foreground ml-1"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        {skills.length === 0 && (
                            <span className="text-sm text-muted-foreground italic">No skills added yet</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

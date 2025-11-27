"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { LanguageFormData } from "@/types/resume-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguagesFormProps {
    language: LanguageFormData;
    onChange: (language: LanguageFormData) => void;
    onRemove: () => void;
    index: number;
}

export function LanguagesForm({
    language,
    onChange,
    onRemove,
    index,
}: LanguagesFormProps) {
    const updateField = (field: keyof LanguageFormData, value: any) => {
        onChange({ ...language, [field]: value });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Language #{index + 1}</CardTitle>
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
                        <Label htmlFor={`language-name-${index}`}>Language *</Label>
                        <Input
                            id={`language-name-${index}`}
                            value={language.language_name}
                            onChange={(e) => updateField("language_name", e.target.value)}
                            placeholder="English"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`proficiency-${index}`}>Proficiency Level *</Label>
                        <Select
                            value={language.proficiency_level}
                            onValueChange={(value) => updateField("proficiency_level", value)}
                        >
                            <SelectTrigger id={`proficiency-${index}`}>
                                <SelectValue placeholder="Select proficiency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Native">Native</SelectItem>
                                <SelectItem value="Fluent">Fluent</SelectItem>
                                <SelectItem value="Proficient">Proficient</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Basic">Basic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

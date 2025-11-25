"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrayInput } from "./array-input";
import { X } from "lucide-react";
import type { EducationFormData } from "@/types/resume-form";

interface EducationFormProps {
  education: EducationFormData;
  onChange: (education: EducationFormData) => void;
  onRemove: () => void;
  index: number;
}

export function EducationForm({
  education,
  onChange,
  onRemove,
  index,
}: EducationFormProps) {
  const updateField = (field: keyof EducationFormData, value: any) => {
    onChange({ ...education, [field]: value });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
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
            <Label htmlFor={`institution-${index}`}>Institution Name *</Label>
            <Input
              id={`institution-${index}`}
              value={education.institution_name}
              onChange={(e) => updateField("institution_name", e.target.value)}
              placeholder="Stanford University"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`degree-${index}`}>Degree *</Label>
            <Input
              id={`degree-${index}`}
              value={education.degree}
              onChange={(e) => updateField("degree", e.target.value)}
              placeholder="Bachelor of Science"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`field-${index}`}>Field of Study</Label>
            <Input
              id={`field-${index}`}
              value={education.field_of_study}
              onChange={(e) => updateField("field_of_study", e.target.value)}
              placeholder="Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edu-location-${index}`}>Location</Label>
            <Input
              id={`edu-location-${index}`}
              value={education.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Stanford, CA"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
            <Input
              id={`edu-start-${index}`}
              type="date"
              value={education.start_date}
              onChange={(e) => updateField("start_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edu-end-${index}`}>End Date</Label>
            <Input
              id={`edu-end-${index}`}
              type="date"
              value={education.end_date}
              onChange={(e) => updateField("end_date", e.target.value)}
              disabled={education.is_current}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`gpa-${index}`}>GPA</Label>
            <Input
              id={`gpa-${index}`}
              value={education.gpa}
              onChange={(e) => updateField("gpa", e.target.value)}
              placeholder="3.8/4.0"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`edu-current-${index}`}
            checked={education.is_current}
            onChange={(e) => updateField("is_current", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor={`edu-current-${index}`} className="font-normal cursor-pointer">
            Currently studying here
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`edu-description-${index}`}>Description</Label>
          <Textarea
            id={`edu-description-${index}`}
            value={education.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Additional details about your education..."
            rows={2}
          />
        </div>

        <ArrayInput
          label="Honors & Awards"
          placeholder="Add an honor or award"
          values={education.honors}
          onChange={(values) => updateField("honors", values)}
        />

        <ArrayInput
          label="Relevant Coursework"
          placeholder="Add a course"
          values={education.relevant_coursework}
          onChange={(values) => updateField("relevant_coursework", values)}
        />
      </CardContent>
    </Card>
  );
}


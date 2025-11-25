"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrayInput } from "./array-input";
import { X } from "lucide-react";
import type { WorkExperienceFormData } from "@/types/resume-form";

interface WorkExperienceFormProps {
  experience: WorkExperienceFormData;
  onChange: (experience: WorkExperienceFormData) => void;
  onRemove: () => void;
  index: number;
}

export function WorkExperienceForm({
  experience,
  onChange,
  onRemove,
  index,
}: WorkExperienceFormProps) {
  const updateField = (field: keyof WorkExperienceFormData, value: any) => {
    onChange({ ...experience, [field]: value });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Work Experience #{index + 1}</CardTitle>
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
            <Label htmlFor={`company-${index}`}>Company Name *</Label>
            <Input
              id={`company-${index}`}
              value={experience.company_name}
              onChange={(e) => updateField("company_name", e.target.value)}
              placeholder="Google"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`position-${index}`}>Position *</Label>
            <Input
              id={`position-${index}`}
              value={experience.position}
              onChange={(e) => updateField("position", e.target.value)}
              placeholder="Software Engineer"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`location-${index}`}>Location</Label>
          <Input
            id={`location-${index}`}
            value={experience.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`start-date-${index}`}>Start Date *</Label>
            <Input
              id={`start-date-${index}`}
              type="date"
              value={experience.start_date}
              onChange={(e) => updateField("start_date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`end-date-${index}`}>End Date</Label>
            <Input
              id={`end-date-${index}`}
              type="date"
              value={experience.end_date}
              onChange={(e) => updateField("end_date", e.target.value)}
              disabled={experience.is_current}
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id={`is-current-${index}`}
                checked={experience.is_current}
                onChange={(e) => updateField("is_current", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor={`is-current-${index}`} className="font-normal cursor-pointer">
                I currently work here
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description-${index}`}>Description</Label>
          <Textarea
            id={`description-${index}`}
            value={experience.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe your role and responsibilities..."
            rows={3}
          />
        </div>

        <ArrayInput
          label="Key Achievements"
          placeholder="Add an achievement"
          values={experience.achievements}
          onChange={(values) => updateField("achievements", values)}
          description="List your major accomplishments in this role"
        />

        <ArrayInput
          label="Technologies Used"
          placeholder="Add a technology"
          values={experience.technologies}
          onChange={(values) => updateField("technologies", values)}
          description="Technologies, tools, and frameworks you worked with"
        />
      </CardContent>
    </Card>
  );
}


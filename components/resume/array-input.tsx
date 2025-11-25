"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface ArrayInputProps {
  label: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
  description?: string;
}

export function ArrayInput({
  label,
  placeholder = "Add item",
  values,
  onChange,
  description,
}: ArrayInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
        />
        <Button type="button" onClick={handleAdd} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {values.length > 0 && (
        <div className="space-y-2 mt-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted rounded-md"
            >
              <span className="flex-1 text-sm">{value}</span>
              <Button
                type="button"
                onClick={() => handleRemove(index)}
                size="icon"
                variant="ghost"
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


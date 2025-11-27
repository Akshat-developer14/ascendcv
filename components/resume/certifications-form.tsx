"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { CertificationFormData } from "@/types/resume-form";

interface CertificationsFormProps {
    certification: CertificationFormData;
    onChange: (certification: CertificationFormData) => void;
    onRemove: () => void;
    index: number;
}

export function CertificationsForm({
    certification,
    onChange,
    onRemove,
    index,
}: CertificationsFormProps) {
    const updateField = (field: keyof CertificationFormData, value: any) => {
        onChange({ ...certification, [field]: value });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Certification #{index + 1}</CardTitle>
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
                        <Label htmlFor={`cert-name-${index}`}>Certification Name *</Label>
                        <Input
                            id={`cert-name-${index}`}
                            value={certification.certification_name}
                            onChange={(e) => updateField("certification_name", e.target.value)}
                            placeholder="AWS Certified Solutions Architect"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`issuer-${index}`}>Issuing Organization *</Label>
                        <Input
                            id={`issuer-${index}`}
                            value={certification.issuing_organization}
                            onChange={(e) => updateField("issuing_organization", e.target.value)}
                            placeholder="Amazon Web Services"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`issue-date-${index}`}>Issue Date</Label>
                        <Input
                            id={`issue-date-${index}`}
                            type="date"
                            value={certification.issue_date}
                            onChange={(e) => updateField("issue_date", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`expiry-date-${index}`}>Expiry Date</Label>
                        <Input
                            id={`expiry-date-${index}`}
                            type="date"
                            value={certification.expiry_date}
                            onChange={(e) => updateField("expiry_date", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`credential-id-${index}`}>Credential ID</Label>
                        <Input
                            id={`credential-id-${index}`}
                            value={certification.credential_id}
                            onChange={(e) => updateField("credential_id", e.target.value)}
                            placeholder="AWS-12345678"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`credential-url-${index}`}>Credential URL</Label>
                        <Input
                            id={`credential-url-${index}`}
                            type="url"
                            value={certification.credential_url}
                            onChange={(e) => updateField("credential_url", e.target.value)}
                            placeholder="https://aws.amazon.com/verify"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                        id={`description-${index}`}
                        value={certification.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="Brief description of the certification..."
                        rows={2}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

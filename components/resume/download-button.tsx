"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface DownloadButtonProps {
    targetId: string;
    fileName: string;
}

export function DownloadButton({ targetId, fileName }: DownloadButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        try {
            setIsGenerating(true);
            const element = document.getElementById(targetId);

            if (!element) {
                console.error(`Element with id ${targetId} not found`);
                return;
            }

            // Use html-to-image to generate PNG
            // We reset margins and transforms to ensure the image is captured without offsets
            const dataUrl = await toPng(element, {
                quality: 0.95,
                backgroundColor: "#ffffff",
                style: {
                    margin: "0",
                    transform: "none",
                },
            });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Handle multi-page PDF if content is long
            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = pdfHeight;
            let position = 0;

            // Add first page
            pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            // Add subsequent pages if needed
            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${fileName}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button onClick={handleDownload} disabled={isGenerating}>
            {isGenerating ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                </>
            ) : (
                <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </>
            )}
        </Button>
    );
}

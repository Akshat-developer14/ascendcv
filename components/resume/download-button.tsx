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

            // Capture links before generating image
            const links = Array.from(element.querySelectorAll("a")).map((link) => {
                const rect = link.getBoundingClientRect();
                const containerRect = element.getBoundingClientRect();
                return {
                    x: rect.left - containerRect.left,
                    y: rect.top - containerRect.top,
                    width: rect.width,
                    height: rect.height,
                    href: link.href,
                };
            });

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
            const scale = pdfWidth / element.offsetWidth;

            // Handle multi-page PDF if content is long
            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = pdfHeight;
            let position = 0;
            let page = 1;

            // Add first page
            pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            // Add subsequent pages if needed
            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                page++;
                pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            // Add links
            links.forEach((link) => {
                const linkX = link.x * scale;
                const linkY = link.y * scale;
                const linkWidth = link.width * scale;
                const linkHeight = link.height * scale;

                // Calculate which page the link falls on
                // Note: linkY is the distance from the top of the *entire* resume
                const linkPage = Math.floor(linkY / pageHeight) + 1;
                const linkYOnPage = linkY % pageHeight;

                // Only add link if it's within the generated pages
                if (linkPage <= page) {
                    pdf.setPage(linkPage);
                    pdf.link(linkX, linkYOnPage, linkWidth, linkHeight, { url: link.href });
                }
            });

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

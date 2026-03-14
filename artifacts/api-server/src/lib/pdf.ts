/**
 * Generate a downloadable PDF from the safety report markdown.
 */
import { jsPDF } from "jspdf";

export function generateSafetyReportPdf(
  productName: string,
  reportMarkdown: string
): Buffer {
  const doc = new jsPDF({ format: "a4", unit: "mm" });
  const pageW = (doc as unknown as { internal: { pageSize: { getWidth: () => number } } }).internal.pageSize.getWidth();
  const margin = 20;
  const maxW = pageW - margin * 2;
  let y = 20;
  const lineHeight = 6;

  const lines = reportMarkdown
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`Invokex Safety Audit: ${productName}`, margin, y);
  y += 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeader = trimmed.startsWith("#") || trimmed.startsWith("**");
    if (isHeader && trimmed.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
    }
    const wrapped = doc.splitTextToSize(trimmed.replace(/^#+\s*|\*\*/g, ""), maxW);
    for (const w of wrapped) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(w, margin, y);
      y += lineHeight;
    }
    if (isHeader) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 2;
    }
  }

  return Buffer.from(doc.output("arraybuffer"));
}

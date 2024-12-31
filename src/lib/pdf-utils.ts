import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToPdf(
  elementId: string,
  filename: string,
  orientation: "portrait" | "landscape" = "portrait"
) {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found");

    // Save current state
    const originalStyle = element.style.cssText;
    const originalScroll = element.parentElement?.scrollTop || 0;

    // Page dimensions (A4)
    const pageWidth = orientation === "portrait" ? 210 : 297;
    const pageHeight = orientation === "portrait" ? 297 : 210;
    const margins = {
      top: 25,
      bottom: 25,
      left: 25,
      right: 25,
    };

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: "a4",
    });

    // Calculate printable area
    const printableWidth = pageWidth - margins.left - margins.right;
    const printableHeight = pageHeight - margins.top - margins.bottom;

    // Get total height and calculate number of pages
    const totalHeight = element.scrollHeight;
    const totalPages = Math.ceil(totalHeight / (printableHeight * 3.779527559));

    // Save original styling
    const originalPosition = element.style.position;
    const originalTop = element.style.top;
    const originalLeft = element.style.left;

    // Prepare element for capture
    element.style.width = `${printableWidth * 3.779527559}px`; // Convert mm to px
    element.style.margin = "0";
    element.style.padding = "20px";
    element.style.position = "relative";

    // Capture each page separately
    for (let i = 0; i < totalPages; i++) {
      // Position element to show current page content
      const yPos = -(printableHeight * 3.779527559 * i);
      element.style.top = `${yPos}px`;

      // Capture current page
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: element.offsetWidth,
        height: Math.min(
          printableHeight * 3.779527559,
          totalHeight - Math.abs(yPos)
        ),
        y: Math.abs(yPos),
        x: 0,
      });

      // Add new page if not first page
      if (i > 0) {
        pdf.addPage();
      }

      // Calculate image dimensions
      const imgWidth = printableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image centered on page
      const xOffset = (pageWidth - printableWidth) / 2;
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        xOffset,
        margins.top,
        imgWidth,
        imgHeight
      );
    }

    // Restore original state
    element.style.position = originalPosition;
    element.style.top = originalTop;
    element.style.left = originalLeft;
    element.style.cssText = originalStyle;
    if (element.parentElement) {
      element.parentElement.scrollTop = originalScroll;
    }

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF export failed:", error);
    return false;
  }
}

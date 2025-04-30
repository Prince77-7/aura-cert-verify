
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface PDFOptions {
  quality?: number;
  filename?: string;
  scale?: number;
  format?: string;
}

export const generatePDF = async (
  element: HTMLElement, 
  fileName: string = "certificate", 
  options: PDFOptions = {}
): Promise<void> => {
  try {
    toast.info("Preparing PDF...");
    
    // Use higher scale for better quality (default to 4x for better resolution)
    const scale = options.scale || 4; 
    
    // Get element dimensions for proper scaling
    const { width, height } = element.getBoundingClientRect();
    
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: null,
      // Improve text rendering
      letterRendering: true,
      // Better quality settings
      imageTimeout: 0,
      // Use devicePixelRatio for better quality on high-DPI displays
      windowWidth: width * scale,
      windowHeight: height * scale,
    });

    const imgData = canvas.toDataURL("image/png", 1.0); // Use maximum quality for PNG
    
    // Create PDF with proper aspect ratio
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (height * pdfWidth) / width;
    
    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "mm",
      format: options.format || "a4",
    });

    // Calculate dimensions to center and fit content properly
    const docWidth = pdf.internal.pageSize.getWidth();
    const docHeight = pdf.internal.pageSize.getHeight();
    
    // Center the image on the page
    const x = (docWidth - pdfWidth) / 2;
    const y = (docHeight - pdfHeight) / 2;
    
    // Add the image to the PDF with proper dimensions
    pdf.addImage(imgData, "PNG", x, y, pdfWidth, pdfHeight);
    
    pdf.save(`${fileName}.pdf`);
    
    toast.success("PDF downloaded successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
  }
};

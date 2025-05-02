
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Certificate } from "@/types/Certificate";

// Helper function to generate a PDF from the certificate
export const generateCertificatePDF = async (
  certificateElement: HTMLElement,
  certificate: Certificate
): Promise<Blob> => {
  try {
    console.log("Starting PDF generation for certificate:", certificate.id);
    
    // Use a higher scale factor (4) for better quality
    const canvas = await html2canvas(certificateElement, {
      scale: 4, // Increased for higher resolution
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      // Remove letterRendering which is causing the TS error
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate PDF dimensions based on canvas
    const imgWidth = 210; // A4 width in mm (portrait)
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    
    console.log("PDF generation completed successfully");
    
    return pdf.output("blob");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Helper function to download the generated PDF
export const downloadCertificatePDF = async (
  certificateElement: HTMLElement,
  certificate: Certificate
): Promise<void> => {
  try {
    const pdfBlob = await generateCertificatePDF(certificateElement, certificate);
    const fileName = `${certificate.recipientName.replace(/\s+/g, "_")}_Certificate.pdf`;
    
    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Certificate downloaded successfully");
  } catch (error) {
    console.error("Error downloading certificate:", error);
    throw error;
  }
};

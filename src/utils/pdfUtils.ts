
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export const generatePDF = async (element: HTMLElement, fileName: string = "certificate"): Promise<void> => {
  try {
    toast.info("Preparing PDF...");
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
    
    toast.success("PDF downloaded successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
  }
};

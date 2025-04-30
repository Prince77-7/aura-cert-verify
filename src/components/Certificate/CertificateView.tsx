
import React, { useRef } from "react";
import { Certificate } from "../../types/Certificate";
import { CertificateTemplate } from "../../types/CertificateTemplate";
import { getTemplateById, getDefaultTemplate } from "../../services/templateService";
import CertificatePreview from "./CertificatePreview";
import { generatePDF } from "../../utils/pdfUtils";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { toast } from "sonner";
import { FileText } from "lucide-react";

interface CertificateViewProps {
  certificate: Certificate;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  // Get template for this certificate
  const template = certificate.templateId 
    ? getTemplateById(certificate.templateId) 
    : getDefaultTemplate();
    
  const handleDownloadPDF = async () => {
    if (!certificateRef.current) {
      toast.error("Error preparing certificate for download");
      return;
    }
    
    const fileName = `${certificate.title.replace(/\s+/g, '_')}_${certificate.recipientName.replace(/\s+/g, '_')}`;
    await generatePDF(certificateRef.current, fileName);
  };
  
  return (
    <Card className="glass w-full">
      <CardHeader>
        <CardTitle>Certificate Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-full overflow-auto">
          <div className="scale-[0.6] origin-top-left transform">
            <CertificatePreview
              ref={certificateRef}
              certificate={certificate}
              template={template || getDefaultTemplate()}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDownloadPDF}
          className="w-full"
        >
          <FileText className="mr-2" />
          Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CertificateView;


import React, { useRef, useState, useEffect } from "react";
import { Certificate } from "../../types/Certificate";
import { CertificateTemplate } from "../../types/CertificateTemplate";
import { getTemplateById, getDefaultTemplate } from "../../services/templateService";
import CertificatePreview from "./CertificatePreview";
import { generatePDF } from "../../utils/pdfUtils";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CertificateViewProps {
  certificate: Certificate;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        // Get template for this certificate
        let templateData: CertificateTemplate | undefined;
        
        if (certificate.templateId) {
          templateData = await getTemplateById(certificate.templateId);
        }
        
        if (!templateData) {
          templateData = await getDefaultTemplate();
        }
        
        setTemplate(templateData);
      } catch (error) {
        console.error("Error loading template:", error);
        toast.error("Failed to load certificate template");
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplate();
  }, [certificate.templateId]);
    
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
        {loading || !template ? (
          <div className="w-full">
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <div className="w-full overflow-auto">
            <div className="scale-[0.6] origin-top-left transform">
              <CertificatePreview
                ref={certificateRef}
                certificate={certificate}
                template={template}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDownloadPDF}
          className="w-full"
          disabled={loading || !template}
        >
          <FileText className="mr-2" />
          Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CertificateView;

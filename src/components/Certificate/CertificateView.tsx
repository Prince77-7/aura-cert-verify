import React, { useState, useEffect, useRef } from 'react';
import { Certificate } from '@/types/Certificate';
import { CertificateTemplate } from '@/types/CertificateTemplate';
import { getTemplateById } from '@/services/templateService';
import { CertificatePreview } from './CertificatePreview';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Download, AlertCircle } from 'lucide-react';
import { generatePdfFromMarkupGo } from '@/services/markupGoService';

interface CertificateViewProps {
  certificate: Certificate;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate }) => {
  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!certificate.templateId) {
        toast.error("Certificate is missing a template ID.");
        setIsLoadingTemplate(false);
        return;
      }
      try {
        setIsLoadingTemplate(true);
        const fetchedTemplate = await getTemplateById(certificate.templateId);
        if (fetchedTemplate) {
          setTemplate(fetchedTemplate);
        } else {
          toast.error(`Template with ID ${certificate.templateId} not found.`);
        }
      } catch (error) {
        console.error("Error loading template:", error);
        toast.error("Failed to load certificate template.");
      } finally {
        setIsLoadingTemplate(false);
      }
    };

    loadTemplate();
  }, [certificate.templateId]);

  const handleDownloadClick = async () => {
    if (certificate.publicPdfUrl) {
      try {
        console.log("Using cached PDF URL:", certificate.publicPdfUrl);
        const link = document.createElement('a');
        link.href = certificate.publicPdfUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('download', `certificate-${certificate.recipientName.replace(/\s+/g, '_')}-${certificate.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        toast.success('PDF download started from cache.');
      } catch (e) {
        console.error("Error trying to download from cached URL:", e);
        toast.error("Failed to initiate download from cached URL.");
      }
      return;
    }

    toast.info('Pre-generated PDF not available for this certificate.');
  };

  if (isLoadingTemplate) {
    return <Skeleton className="w-full h-[500px]" />;
  }

  if (!template) {
    return <div className="text-center text-red-500">Failed to load certificate template. Cannot display certificate.</div>;
  }

  return (
    <div className="space-y-6">
      <div ref={certificateRef}>
        <CertificatePreview certificate={certificate} template={template} />
      </div>

      <div className="text-center">
        {certificate.publicPdfUrl ? (
          <Button 
            onClick={handleDownloadClick} 
            className="mt-4"
            title="Download cached PDF"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        ) : (
          <Button 
            className="mt-4" 
            disabled 
            variant="outline"
            title="No pre-generated PDF available"
          >
            <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
            PDF Not Available
          </Button>
        )}
      </div>
    </div>
  );
};

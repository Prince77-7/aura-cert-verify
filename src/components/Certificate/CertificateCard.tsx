import React, { useState, useEffect } from "react";
import { Certificate } from "../../types/Certificate";
import { CertificateTemplate } from "../../types/CertificateTemplate";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { getTemplateById, getDefaultTemplate } from "../../services/templateService";
import { CertificateView } from "./CertificateView";
import { FileText, Pencil } from "lucide-react";
import { toast } from "sonner";

interface CertificateCardProps {
  certificate: Certificate;
  showActions?: boolean;
  onRevoke?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  showActions = false,
  onRevoke,
  onDelete,
  onEdit,
}) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [templateName, setTemplateName] = useState<string>("Default Template");
  
  useEffect(() => {
    const loadTemplateName = async () => {
      try {
        let template: CertificateTemplate | undefined;
        
        if (certificate.templateId) {
          template = await getTemplateById(certificate.templateId);
        }
        
        if (!template) {
          template = await getDefaultTemplate();
        }
        
        setTemplateName(template.name);
      } catch (error) {
        console.error("Error loading template name:", error);
      }
    };
    
    loadTemplateName();
  }, [certificate.templateId]);
  
  const statusColor = {
    active: "bg-green-500 text-white",
    revoked: "bg-red-500 text-white",
    expired: "bg-amber-500 text-white",
  }[certificate.status];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificate.certificationId);
    toast.success("Verification ID copied to clipboard");
  };

  return (
    <Card className="w-full overflow-hidden glass">
      <CardHeader>
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg md:text-2xl">{certificate.title}</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Issued to: {certificate.recipientName}
            </CardDescription>
          </div>
          <Badge className={statusColor}>
            {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
            <p>{formatDate(certificate.issueDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
            <p>{formatDate(certificate.expiryDate)}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Issuer</p>
          <p>{certificate.issuerName}</p>
        </div>

        {certificate.description && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="text-sm">{certificate.description}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Template</p>
          <p className="text-sm">{templateName}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Verification ID</p>
          <div className="flex gap-2 items-center">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {certificate.certificationId}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              className="h-7 text-xs px-2"
            >
              Copy
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 justify-end border-t p-4">
        {/* Add PDF info if available */}
        {certificate.publicPdfUrl && (
          <div className="w-full mb-2 text-sm text-green-600 flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            PDF document available for download
          </div>
        )}
        
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogTrigger asChild onClick={(e) => {
            // Stop any download behavior
            e.preventDefault();
            e.stopPropagation();
            // Just trigger the dialog
            setViewOpen(true);
          }}>
            <Button 
              variant={certificate.publicPdfUrl ? "default" : "outline"} 
              size="sm" 
              className={certificate.publicPdfUrl ? "bg-blue-600 hover:bg-blue-700" : ""}
              type="button"
            >
              <FileText className="mr-2 h-4 w-4" />
              View Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl md:max-w-4xl p-0 overflow-hidden bg-transparent border-0 backdrop-blur-none">
            <div className="bg-background/80 backdrop-blur-xl rounded-lg p-6 w-full h-full">
              <DialogTitle className="sr-only">Certificate Details</DialogTitle>
              <DialogDescription className="sr-only">
                View and download certificate for {certificate.recipientName}
              </DialogDescription>
              <CertificateView certificate={certificate} />
            </div>
          </DialogContent>
        </Dialog>
        
        {showActions && (
          <>
            {/* Removed customization button as we're using MarkupGo for certificates */}
            
            {certificate.status === "active" && onRevoke && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRevoke(certificate.id)}
              >
                Revoke
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(certificate.id)}
              >
                Delete
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;

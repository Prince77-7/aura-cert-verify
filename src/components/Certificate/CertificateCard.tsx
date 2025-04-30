
import React from "react";
import { Certificate } from "../../types/Certificate";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";

interface CertificateCardProps {
  certificate: Certificate;
  showActions?: boolean;
  onRevoke?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  showActions = false,
  onRevoke,
  onDelete,
}) => {
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
      
      {showActions && (
        <CardFooter className="flex gap-2 justify-end border-t p-4">
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
        </CardFooter>
      )}
    </Card>
  );
};

export default CertificateCard;

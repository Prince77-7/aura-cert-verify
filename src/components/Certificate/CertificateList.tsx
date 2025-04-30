
import React from "react";
import { Certificate } from "../../types/Certificate";
import CertificateCard from "./CertificateCard";

interface CertificateListProps {
  certificates: Certificate[];
  onRevoke?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const CertificateList: React.FC<CertificateListProps> = ({
  certificates,
  onRevoke,
  onDelete,
  onEdit
}) => {
  if (certificates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No certificates found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          showActions={!!onRevoke || !!onDelete || !!onEdit}
          onRevoke={onRevoke}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default CertificateList;

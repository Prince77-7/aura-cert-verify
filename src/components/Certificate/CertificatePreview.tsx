
import React, { forwardRef } from "react";
import { Certificate } from "../../types/Certificate";
import { CertificateTemplate } from "../../types/CertificateTemplate";

interface CertificatePreviewProps {
  certificate: Certificate;
  template: CertificateTemplate;
}

export const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  ({ certificate, template }, ref) => {
    const styles = template.styles;

    const formatDate = (dateString?: string) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    };

    return (
      <div
        ref={ref}
        className="certificate-preview mx-auto shadow-xl"
        style={{
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
          border: `${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor}`,
          width: styles.width,
          height: styles.height,
          fontFamily: styles.fontFamily,
          position: "relative",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          className="certificate-logo"
          style={{
            width: styles.logoStyles.width,
            height: styles.logoStyles.height,
            margin: styles.logoStyles.margin,
          }}
        >
          {/* Logo would go here */}
        </div>

        {/* Header */}
        <div className="certificate-content w-full flex-1 flex flex-col items-center justify-center">
          <h1
            className="certificate-title"
            style={{
              fontSize: styles.titleStyles.fontSize,
              fontWeight: styles.titleStyles.fontWeight,
              color: styles.titleStyles.color,
              textAlign: styles.titleStyles.textAlign as any,
              marginTop: styles.titleStyles.marginTop,
              marginBottom: styles.titleStyles.marginBottom,
              width: "100%",
            }}
          >
            {certificate.title}
          </h1>

          <p
            className="certificate-recipient"
            style={{
              fontSize: styles.recipientStyles.fontSize,
              fontWeight: styles.recipientStyles.fontWeight,
              color: styles.recipientStyles.color,
              textAlign: styles.recipientStyles.textAlign as any,
              marginTop: styles.recipientStyles.marginTop,
              marginBottom: styles.recipientStyles.marginBottom,
              width: "100%",
            }}
          >
            {certificate.recipientName}
          </p>

          {certificate.description && (
            <p
              className="certificate-description"
              style={{
                fontSize: styles.descriptionStyles.fontSize,
                fontWeight: styles.descriptionStyles.fontWeight,
                color: styles.descriptionStyles.color,
                textAlign: styles.descriptionStyles.textAlign as any,
                marginTop: styles.descriptionStyles.marginTop,
                marginBottom: styles.descriptionStyles.marginBottom,
                width: "100%",
              }}
            >
              {certificate.description}
            </p>
          )}

          <div
            className="certificate-dates"
            style={{
              fontSize: styles.dateStyles.fontSize,
              fontWeight: styles.dateStyles.fontWeight,
              color: styles.dateStyles.color,
              textAlign: styles.dateStyles.textAlign as any,
              marginTop: styles.dateStyles.marginTop,
              marginBottom: styles.dateStyles.marginBottom,
              width: "100%",
            }}
          >
            <p>Issue Date: {formatDate(certificate.issueDate)}</p>
            {certificate.expiryDate && <p>Expiry Date: {formatDate(certificate.expiryDate)}</p>}
          </div>
        </div>

        {/* Footer with issuer and signature */}
        <div className="certificate-footer w-full flex flex-col items-center">
          <div
            className="certificate-signature"
            style={{
              width: styles.signatureStyles.width,
              height: styles.signatureStyles.height,
              margin: styles.signatureStyles.margin,
              borderTop: "1px solid #000",
            }}
          >
            {/* Signature line */}
          </div>

          <p
            className="certificate-issuer"
            style={{
              fontSize: styles.issuerStyles.fontSize,
              fontWeight: styles.issuerStyles.fontWeight,
              color: styles.issuerStyles.color,
              textAlign: styles.issuerStyles.textAlign as any,
              marginTop: styles.issuerStyles.marginTop,
              marginBottom: styles.issuerStyles.marginBottom,
            }}
          >
            {certificate.issuerName}
          </p>
        </div>

        {/* Verification ID */}
        <div
          className="certificate-verification"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          ID: {certificate.certificationId}
        </div>
      </div>
    );
  }
);

CertificatePreview.displayName = "CertificatePreview";

export default CertificatePreview;

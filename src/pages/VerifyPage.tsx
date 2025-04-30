
import React from "react";
import CertificateVerifier from "../components/Certificate/CertificateVerifier";

const VerifyPage: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto py-12">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold">Certificate Verification</h1>
        <p className="text-muted-foreground">
          Verify the authenticity of certificates issued through our platform
        </p>
      </div>

      <CertificateVerifier />
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground max-w-lg mx-auto">
          Our verification system ensures the authenticity of all certificates. 
          If you encounter any issues, please contact the certificate issuer.
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;

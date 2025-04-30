
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { getCertificateByVerificationId } from "../../services/certificateService";
import CertificateCard from "./CertificateCard";
import { toast } from "sonner";
import { Certificate } from "@/types/Certificate";
import { Skeleton } from "@/components/ui/skeleton";

export const CertificateVerifier: React.FC = () => {
  const [verificationId, setVerificationId] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!verificationId.trim()) {
      toast.error("Please enter a verification ID");
      return;
    }

    setLoading(true);
    try {
      const result = await getCertificateByVerificationId(verificationId.trim());
      if (result) {
        setCertificate(result);
      } else {
        setCertificate(null);
        toast.error("Certificate not found");
      }
    } catch (error) {
      toast.error("Verification failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass">
      <CardHeader>
        <CardTitle>Verify Certificate</CardTitle>
        <CardDescription>
          Enter the certificate verification ID to confirm its authenticity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Enter verification ID (e.g. XXXX-XXXX-XXXX)"
            value={verificationId}
            onChange={(e) => setVerificationId(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleVerify} disabled={loading} className="whitespace-nowrap">
            {loading ? "Verifying..." : "Verify Certificate"}
          </Button>
        </div>

        {loading && (
          <div className="animate-fade-in">
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {!loading && certificate && (
          <div className="animate-fade-in">
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
              <p className="text-green-700 dark:text-green-400 text-center font-medium">
                Certificate Verified Successfully
              </p>
            </div>
            <CertificateCard certificate={certificate} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificateVerifier;

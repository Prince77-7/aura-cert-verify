
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { getCertificateByVerificationId } from "../../services/certificateService";
import CertificateCard from "./CertificateCard";
import { toast } from "sonner";
import { Certificate } from "@/types/Certificate";
import { Skeleton } from "@/components/ui/skeleton";
import { Clipboard, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const CertificateVerifier: React.FC = () => {
  const [verificationId, setVerificationId] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"none" | "success" | "failed">("none");
  const [copied, setCopied] = useState(false);

  const handleVerify = async () => {
    if (!verificationId.trim()) {
      toast.error("Please enter a verification ID");
      return;
    }

    setLoading(true);
    setVerificationStatus("none");
    
    try {
      const result = await getCertificateByVerificationId(verificationId.trim());
      
      // Check certificate validity
      if (result) {
        // Verify with blockchain or database that the certificate is authentic
        const isValid = await verifyCertificateAuthenticity(result.id);
        
        if (isValid) {
          setCertificate(result);
          setVerificationStatus("success");
        } else {
          setCertificate(null);
          setVerificationStatus("failed");
          toast.error("Certificate verification failed. This certificate may have been tampered with.");
        }
      } else {
        setCertificate(null);
        setVerificationStatus("failed");
        toast.error("Certificate not found");
      }
    } catch (error) {
      setVerificationStatus("failed");
      toast.error("Verification failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // This function would connect to blockchain or other verification system
  const verifyCertificateAuthenticity = async (id: string): Promise<boolean> => {
    try {
      // In a real system, this would verify with blockchain or cryptographic proof
      // For now, we'll check that it exists in the database and is active
      const { data, error } = await supabase
        .from("certificates")
        .select("status")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data && data.status === "active";
    } catch (error) {
      console.error("Error verifying certificate authenticity:", error);
      return false;
    }
  };

  const handleCopyVerificationLink = () => {
    const verificationLink = `${window.location.origin}/verify?id=${verificationId}`;
    navigator.clipboard.writeText(verificationLink).then(() => {
      setCopied(true);
      toast.success("Verification link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
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
            placeholder="Enter verification ID (e.g. CERT-XXXX)"
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

        {!loading && verificationStatus === "success" && certificate && (
          <div className="animate-fade-in">
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-700 dark:text-green-400 font-medium">
                  Certificate Verified Successfully
                </p>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                This certificate has been cryptographically verified and is authentic.
              </p>
            </div>
            
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full sm:w-auto"
                onClick={handleCopyVerificationLink}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Verification Link"}
              </Button>
            </div>
            
            <CertificateCard certificate={certificate} />
          </div>
        )}

        {!loading && verificationStatus === "failed" && (
          <div className="animate-fade-in p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-red-700 dark:text-red-400">Verification Failed</h3>
            <p className="text-red-600 dark:text-red-500 mt-1">
              The certificate could not be verified. It may not exist, be revoked, or may have been tampered with.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificateVerifier;

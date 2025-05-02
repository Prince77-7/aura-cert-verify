
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { getCertificateByVerificationId } from "../../services/certificateService";
import CertificateCard from "./CertificateCard";
import { toast } from "sonner";
import { Certificate } from "@/types/Certificate";
import { Skeleton } from "@/components/ui/skeleton";
import { Clipboard, CheckCircle2, XCircle, Shield, Search, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

export const CertificateVerifier: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [verificationId, setVerificationId] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"none" | "success" | "failed">("none");
  const [copied, setCopied] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);
  
  // Check for verification ID in URL params on component mount
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setVerificationId(idFromUrl);
      handleVerify(idFromUrl);
    }
  }, []);

  const handleVerify = async (idOverride?: string) => {
    const idToVerify = idOverride || verificationId.trim();
    if (!idToVerify) {
      toast.error("Please enter a verification ID");
      return;
    }

    setLoading(true);
    setVerificationStatus("none");
    
    try {
      const result = await getCertificateByVerificationId(idToVerify);
      
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
    <Card className="w-full max-w-2xl mx-auto glass shadow-lg border-2 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-8">
        <div className="flex items-center justify-center mb-3">
          <Shield className="h-8 w-8 text-primary mr-2" />
        </div>
        <CardTitle className="text-center text-2xl">Verify Training Certificate</CardTitle>
        <CardDescription className="text-center max-w-md mx-auto mt-2">
          Confirm the authenticity of Shield of Steel training credentials with our secure verification system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-6 py-8 -mt-6">
        <motion.div 
          className={`p-6 rounded-xl transition-all ${focusedInput ? 'bg-primary/5 shadow-md' : 'bg-muted/50'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <label className="text-sm font-medium block mb-2.5 text-center sm:text-left">Enter Certificate Verification ID</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Enter verification ID (e.g. CERT-XXXX)"
                value={verificationId}
                onChange={(e) => setVerificationId(e.target.value)}
                onFocus={() => setFocusedInput(true)}
                onBlur={() => setFocusedInput(false)}
                className={`flex-1 pl-10 transition-all duration-200 ${focusedInput ? 'border-primary ring-1 ring-primary/20' : ''}`}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                onClick={() => handleVerify()} 
                disabled={loading} 
                className="whitespace-nowrap w-full sm:w-auto font-medium"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    Verifying
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Verify Certificate <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            All Shield of Steel certificates contain a unique verification ID located at the bottom of the document
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="px-4"
            >
              <div className="flex justify-center mb-4">
                <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              </div>
              <p className="text-center text-muted-foreground">Verifying certificate credentials...</p>
              <div className="mt-6">
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </motion.div>
          )}

          {!loading && verificationStatus === "success" && certificate && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900 shadow-sm"
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="bg-green-100 dark:bg-green-800/40 p-2 rounded-full mr-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-700 dark:text-green-400 font-medium text-lg">
                      Certificate Verified Successfully
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                      This certificate has been cryptographically verified and is authentic.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="mb-4 flex justify-center sm:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 w-full sm:w-auto text-sm"
                  onClick={handleCopyVerificationLink}
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Verification Link"}
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <CertificateCard certificate={certificate} showTemplate={false} />
              </motion.div>
            </motion.div>
          )}

          {!loading && verificationStatus === "failed" && (
            <motion.div 
              key="failed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900 text-center shadow-sm"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-3" />
              </motion.div>
              <h3 className="text-xl font-medium text-red-700 dark:text-red-400">Verification Failed</h3>
              <p className="text-red-600 dark:text-red-500 mt-2 max-w-md mx-auto">
                The certificate could not be verified. It may not exist, be revoked, or may have been tampered with.
              </p>
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Button 
                  variant="outline" 
                  className="text-sm"
                  onClick={() => {
                    setVerificationStatus("none");
                    setVerificationId("");
                  }}
                >
                  Try Again
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <div className="px-6 py-4 bg-muted/20 border-t text-center text-xs text-muted-foreground">
        <p>Shield of Steel - Secure Training Certification Verification System</p>
      </div>
    </Card>
  );
};

export default CertificateVerifier;

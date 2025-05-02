
import React from "react";
import CertificateVerifier from "../components/Certificate/CertificateVerifier";
import { Shield, CheckCircle2, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";

const VerifyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-16">
      <div className="container max-w-5xl mx-auto pt-12 pb-20">
        {/* Page Header with Animation */}
        <motion.div 
          className="space-y-3 text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Certificate Verification</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verify the authenticity of Shield of Steel training certifications
          </p>
        </motion.div>

        <CertificateVerifier />
        
        {/* Trust Indicators */}
        <div className="mt-16">
          <motion.h2 
            className="text-xl font-semibold text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Secure Verification System
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Tamper-Proof Records</h3>
              <p className="text-sm text-muted-foreground">
                Each certificate contains cryptographic signatures that prevent forgery and ensure authenticity
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <LockKeyhole className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Secure Verification</h3>
              <p className="text-sm text-muted-foreground">
                Our verification system provides instant confirmation of certification legitimacy
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Government Standards</h3>
              <p className="text-sm text-muted-foreground">
                All certificates meet rigorous compliance and security standards required by regulatory bodies
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;

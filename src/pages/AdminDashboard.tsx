
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import CertificateForm from "../components/Certificate/CertificateForm";
import CertificateList from "../components/Certificate/CertificateList";
import { getCertificates, revokeCertificate, deleteCertificate } from "../services/certificateService";
import { Certificate } from "../types/Certificate";
import { toast } from "sonner";

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [newCertificateId, setNewCertificateId] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      setCertificates(getCertificates());
    }
  }, [isAuthenticated, refreshCount]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleRevoke = (id: string) => {
    if (window.confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) {
      revokeCertificate(id);
      setRefreshCount(prev => prev + 1);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this certificate? This action cannot be undone.")) {
      deleteCertificate(id);
      setRefreshCount(prev => prev + 1);
    }
  };

  const handleCreateSuccess = (certificationId: string) => {
    setRefreshCount(prev => prev + 1);
    setNewCertificateId(certificationId);
    toast.success("Certificate created successfully");
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and create certificates from this dashboard
        </p>
      </div>

      <Tabs defaultValue="certificates" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="certificates">View Certificates</TabsTrigger>
          <TabsTrigger value="create">Create Certificate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="certificates" className="mt-6">
          <div className="mb-6">
            <Button 
              onClick={() => setRefreshCount(prev => prev + 1)}
              variant="outline"
              className="mb-4"
            >
              Refresh List
            </Button>
            
            {newCertificateId && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                <p className="text-green-700 dark:text-green-400">
                  New certificate created with ID: <strong>{newCertificateId}</strong>
                </p>
              </div>
            )}
            
            <CertificateList 
              certificates={certificates}
              onRevoke={handleRevoke}
              onDelete={handleDelete}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          <CertificateForm onSuccess={handleCreateSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

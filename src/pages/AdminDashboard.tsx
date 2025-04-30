
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import CertificateForm from "../components/Certificate/CertificateForm";
import CertificateList from "../components/Certificate/CertificateList";
import { getCertificates, revokeCertificate, deleteCertificate, getCertificateById } from "../services/certificateService";
import { getTemplateById } from "../services/templateService";
import { Certificate } from "../types/Certificate";
import { CertificateTemplate } from "../types/CertificateTemplate";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import AdvancedCertificateEditor from "@/components/Certificate/AdvancedCertificateEditor";

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [newCertificateId, setNewCertificateId] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("certificates");
  const [loadingCertificateEditor, setLoadingCertificateEditor] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      getCertificates()
        .then(data => {
          setCertificates(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch certificates:", error);
          setLoading(false);
          toast.error("Failed to load certificates");
        });
    }
  }, [isAuthenticated, refreshCount]);

  useEffect(() => {
    if (selectedCertificateId) {
      loadCertificateAndTemplate(selectedCertificateId);
    }
  }, [selectedCertificateId]);

  const loadCertificateAndTemplate = async (certId: string) => {
    setLoadingCertificateEditor(true);
    try {
      const certificate = await getCertificateById(certId);
      if (certificate) {
        setSelectedCertificate(certificate);
        
        // Load template
        if (certificate.templateId) {
          const template = await getTemplateById(certificate.templateId);
          if (template) {
            setSelectedTemplate(template);
          } else {
            toast.error("Certificate template not found");
          }
        } else {
          toast.error("Certificate has no template assigned");
        }
      } else {
        toast.error("Certificate not found");
      }
    } catch (error) {
      console.error("Error loading certificate and template:", error);
      toast.error("Failed to load certificate data");
    } finally {
      setLoadingCertificateEditor(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleRevoke = async (id: string) => {
    if (window.confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) {
      try {
        await revokeCertificate(id);
        setRefreshCount(prev => prev + 1);
      } catch (error) {
        console.error("Failed to revoke certificate:", error);
        toast.error("Failed to revoke certificate");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this certificate? This action cannot be undone.")) {
      try {
        await deleteCertificate(id);
        setRefreshCount(prev => prev + 1);
      } catch (error) {
        console.error("Failed to delete certificate:", error);
        toast.error("Failed to delete certificate");
      }
    }
  };

  const handleCreateSuccess = (certificationId: string) => {
    setRefreshCount(prev => prev + 1);
    setNewCertificateId(certificationId);
  };

  const handleEditCertificate = (certId: string) => {
    setSelectedCertificateId(certId);
    setActiveTab("customize");
  };

  const handleCertificateUpdate = (updatedCertificate: Certificate) => {
    // Update certificates list
    const updatedCertificates = certificates.map(cert => 
      cert.id === updatedCertificate.id ? updatedCertificate : cert
    );
    setCertificates(updatedCertificates);
    setSelectedCertificate(updatedCertificate);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and create certificates from this dashboard
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-3">
          <TabsTrigger value="certificates">View Certificates</TabsTrigger>
          <TabsTrigger value="create">Create Certificate</TabsTrigger>
          <TabsTrigger value="customize" disabled={!selectedCertificateId}>Customize Certificate</TabsTrigger>
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
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <div className="flex justify-end mt-4 gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CertificateList 
                certificates={certificates}
                onRevoke={handleRevoke}
                onDelete={handleDelete}
                onEdit={handleEditCertificate}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          <CertificateForm onSuccess={handleCreateSuccess} />
        </TabsContent>

        <TabsContent value="customize" className="mt-6">
          {loadingCertificateEditor ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-[600px] w-full" />
            </div>
          ) : selectedCertificate && selectedTemplate ? (
            <AdvancedCertificateEditor 
              certificate={selectedCertificate}
              template={selectedTemplate}
              onUpdate={handleCertificateUpdate}
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No Certificate Selected</h3>
              <p className="text-muted-foreground mb-6">
                Please select a certificate from the list to customize
              </p>
              <Button 
                onClick={() => setActiveTab("certificates")}
                variant="outline"
              >
                Go to Certificates
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

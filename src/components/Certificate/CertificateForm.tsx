import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { createCertificate } from "../../services/certificateService";
import { getTemplates, getDefaultTemplate } from "../../services/templateService";
import { CertificateTemplate } from "../../types/CertificateTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import CertificatePreview from "./CertificatePreview";
import TemplateList from "./TemplateList";
import TemplateEditor from "./TemplateEditor";
import { generatePDF } from "../../utils/pdfUtils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  recipientName: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional(),
  issuerName: z.string().min(2, "Issuer name must be at least 2 characters"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CertificateFormProps {
  onSuccess?: (certificationId: string) => void;
}

export const CertificateForm: React.FC<CertificateFormProps> = ({ onSuccess }) => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
  const [previewCertificate, setPreviewCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      title: "",
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      issuerName: "",
      description: "",
    },
  });

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await getTemplates();
        setTemplates(templatesData);
        
        const defaultTemplate = await getDefaultTemplate();
        setSelectedTemplate(defaultTemplate);
      } catch (error) {
        console.error("Error loading templates:", error);
        toast.error("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!selectedTemplate) {
      toast.error("No template selected");
      return;
    }
    
    try {
      // Fix the TypeError by ensuring all required properties are provided
      const certificate = await createCertificate({
        recipientName: values.recipientName,
        title: values.title,
        issueDate: values.issueDate,
        expiryDate: values.expiryDate || undefined,
        issuerName: values.issuerName,
        description: values.description || undefined,
        templateId: selectedTemplate.id,
      });
      
      form.reset();
      
      // Generate preview certificate for PDF download
      setPreviewCertificate({
        ...certificate,
        recipientName: values.recipientName,
        title: values.title,
        issueDate: values.issueDate,
        expiryDate: values.expiryDate,
        issuerName: values.issuerName,
        description: values.description,
      });
      
      if (onSuccess) {
        onSuccess(certificate.certificationId);
      } else {
        toast.success(`Certificate created with ID: ${certificate.certificationId}`);
      }
    } catch (error) {
      toast.error("Failed to create certificate");
      console.error(error);
    }
  };

  const handleSelectTemplate = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    toast.success(`Template "${template.name}" selected`);
  };

  const handleEditTemplate = (template: CertificateTemplate) => {
    setEditingTemplate(template);
  };

  const handleSaveTemplate = (templateData: CertificateTemplate) => {
    // Ensure that the name property is required
    if (!templateData.name) {
      toast.error("Template name is required");
      return;
    }
    
    try {
      // Create a properly typed object for the template service
      const templateToSave: CertificateTemplate = {
        id: editingTemplate ? editingTemplate.id : 'temp-id',
        name: templateData.name,
        description: templateData.description || '',
        createdAt: editingTemplate ? editingTemplate.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        styles: templateData.styles,
      };
      
      // This will be replaced by the service
      if (editingTemplate) {
        // Update existing template
        const updatedTemplate = {
          ...editingTemplate,
          ...templateToSave,
        };
        // Save to localStorage and update state
        const updatedTemplates = templates.map(t => 
          t.id === updatedTemplate.id ? updatedTemplate : t
        );
        localStorage.setItem("aura_certificate_templates", JSON.stringify(updatedTemplates));
        setTemplates(updatedTemplates);
        setSelectedTemplate(updatedTemplate);
        setEditingTemplate(null);
      } else {
        // Create new template
        const newTemplate = {
          ...templateToSave,
          id: `template-${Date.now()}`,
        };
        const updatedTemplates = [...templates, newTemplate];
        localStorage.setItem("aura_certificate_templates", JSON.stringify(updatedTemplates));
        setTemplates(updatedTemplates);
        setSelectedTemplate(newTemplate);
      }
      toast.success("Template saved successfully");
    } catch (error) {
      toast.error("Failed to save template");
      console.error(error);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (templates.length <= 1) {
      toast.error("Cannot delete the last template");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this template?")) {
      const updatedTemplates = templates.filter(t => t.id !== id);
      localStorage.setItem("aura_certificate_templates", JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
      
      // If the deleted template was selected, switch to the first available template
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(updatedTemplates[0]);
      }
      
      toast.success("Template deleted");
    }
  };

  const handleCloneTemplate = (id: string) => {
    const templateToClone = templates.find(t => t.id === id);
    if (!templateToClone) {
      toast.error("Template not found");
      return;
    }
    
    const clonedTemplate = {
      ...templateToClone,
      id: `template-${Date.now()}`,
      name: `${templateToClone.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedTemplates = [...templates, clonedTemplate];
    localStorage.setItem("aura_certificate_templates", JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
    setSelectedTemplate(clonedTemplate);
    
    toast.success("Template cloned");
  };
  
  const handleDownloadPDF = async () => {
    if (!certificateRef.current || !previewCertificate) {
      toast.error("No certificate to download");
      return;
    }
    
    const fileName = `${previewCertificate.title.replace(/\s+/g, '_')}_${previewCertificate.recipientName.replace(/\s+/g, '_')}`;
    await generatePDF(certificateRef.current, fileName);
  };

  // Generate a preview certificate based on form values
  const getPreviewCertificate = () => {
    const values = form.getValues();
    return {
      id: "preview",
      recipientName: values.recipientName || "Recipient Name",
      title: values.title || "Certificate Title",
      issueDate: values.issueDate || new Date().toISOString(),
      expiryDate: values.expiryDate,
      issuerName: values.issuerName || "Issuer Name",
      description: values.description || "Certificate Description",
      certificationId: "XXXX-XXXX-XXXX",
      status: "active" as const,
    };
  };

  if (loading || !selectedTemplate) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full max-w-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="create">Create Certificate</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="w-full glass">
              <CardHeader>
                <CardTitle>Create New Certificate</CardTitle>
                <CardDescription>
                  Fill in the details to create a new certificate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="recipientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certificate Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Advanced Security Certification" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="issueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issue Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="issuerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issuer Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Department of Security" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter certificate details and achievements"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-medium">Selected Template: {selectedTemplate.name}</p>
                      <Button type="button" variant="outline" onClick={() => document.getElementById("template-tab")?.click()}>
                        Change Template
                      </Button>
                    </div>

                    <Button type="submit" className="w-full">
                      Create Certificate
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <div className="w-full overflow-auto">
              <h3 className="text-lg font-medium mb-4">Certificate Preview</h3>
              <div className="scale-[0.6] origin-top-left transform">
                {selectedTemplate && (
                  <CertificatePreview
                    certificate={getPreviewCertificate()}
                    template={selectedTemplate}
                  />
                )}
              </div>
            </div>
          </div>
          
          {previewCertificate && (
            <Card className="mt-6 glass">
              <CardHeader>
                <CardTitle>Certificate Created</CardTitle>
                <CardDescription>
                  Your certificate has been created successfully. You can download it as a PDF.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="hidden">
                  {selectedTemplate && (
                    <CertificatePreview
                      ref={certificateRef}
                      certificate={previewCertificate}
                      template={selectedTemplate}
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleDownloadPDF} className="w-full">
                  Download Certificate as PDF
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <TemplateList
            templates={templates}
            onSelect={handleSelectTemplate}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            onClone={handleCloneTemplate}
          />
        </TabsContent>
        
        <TabsContent value="design" className="mt-6">
          {editingTemplate ? (
            <>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Edit Template: {editingTemplate.name}</h2>
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  Cancel Editing
                </Button>
              </div>
              <TemplateEditor
                template={editingTemplate}
                onSave={handleSaveTemplate}
              />
            </>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Create New Template</h2>
              </div>
              <TemplateEditor
                template={{
                  id: "",
                  name: "New Template",
                  createdAt: "",
                  updatedAt: "",
                  description: "Default certificate template",
                  styles: selectedTemplate.styles,
                }}
                onSave={handleSaveTemplate}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificateForm;

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
import { CertificateTemplate } from "@/types/CertificateTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import CertificatePreview from "./CertificatePreview";
import TemplateList from "./TemplateList";
import TemplateEditor from "./TemplateEditor";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomFieldNames } from '@/services/settingsService';
import { Separator } from '@/components/ui/separator';
import { supabase } from '../../lib/supabaseClient';

const formSchema = z.object({
  recipientName: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional(),
  issuerName: z.string().min(2, "Issuer name must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface CertificateFormProps {
  onSuccess?: (certificationId: string) => void;
}

const triggerBackendPdfGeneration = async (certificateId: string, templateId: string): Promise<{ success: boolean; pdfUrl?: string; error?: string }> => {
  console.log(`Invoking Supabase Edge Function 'super-endpoint' for cert ID: ${certificateId}, template ID: ${templateId}`);

  try {
    const { data, error } = await supabase.functions.invoke('super-endpoint', {
      body: { certificateId, templateId }, 
    });

    if (error) {
      const errorMessage = data?.error || error.message || 'Unknown error invoking function.';
      console.error('Error invoking Supabase function:', errorMessage);
      let detail = '';
      try {
        if (error instanceof Error && (error as any).context) { 
          detail = (error as any).context?.details || JSON.stringify((error as any).context);
        }
      } catch (e) {}
      return { success: false, error: `${errorMessage}${detail ? ` (${detail})` : ''}` };
    }

    if (data?.success === false) {
      console.error('Backend function returned an error:', data.error);
      return { success: false, error: data.error || 'Backend function failed.' };
    }

    console.log('Supabase function executed successfully. PDF URL:', data?.pdfUrl);
    return { success: true, pdfUrl: data?.pdfUrl };

  } catch (error: any) {
    console.error('Unexpected error calling triggerBackendPdfGeneration:', error);
    return { success: false, error: error.message || 'Failed to trigger PDF generation due to an unexpected error.' };
  }
};

export const CertificateForm: React.FC<CertificateFormProps> = ({ onSuccess }) => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
  const [previewCertificate, setPreviewCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [customFieldNames, setCustomFieldNames] = useState<string[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [savedCertificate, setSavedCertificate] = useState<any>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfGenerationResult, setPdfGenerationResult] = useState<{ success?: boolean; message?: string; pdfUrl?: string }>({});
  const [creatingCertificateOnly, setCreatingCertificateOnly] = useState(false);
  const [currentStep, setCurrentStep] = useState<1|2>(1); // Track current step in the process

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      title: "",
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      issuerName: "",
    },
  });
  
  // Helper function to ensure template has the required markupgo_template_id field
  const ensureTemplateHasMarkupGoId = (template: any): CertificateTemplate => {
    if (!template.markupgo_template_id) {
      console.warn('Template is missing markupgo_template_id, using fallback empty string');
      return {
        ...template,
        markupgo_template_id: ''
      };
    }
    return template;
  };

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

  useEffect(() => {
    setCustomFieldNames(getCustomFieldNames());
  }, []);

  // STEP 1: Create a certificate record with verification ID but mark it as inactive/pending
  const createCertificateOnly = async () => {
    if (!selectedTemplate) {
      toast.error("No template selected");
      return;
    }

    // Get current form values
    const values = form.getValues();
    
    // Validate required fields
    if (!values.recipientName || !values.title || !values.issueDate || !values.issuerName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreatingCertificateOnly(true);
    
    try {
      // Create certificate WITHOUT custom data and mark it as pending
      // Since status is not a valid field for the certificate creation function,
      // we'll create the certificate first then update its status
      const certificate = await createCertificate({
        recipientName: values.recipientName,
        title: values.title,
        issueDate: values.issueDate,
        expiryDate: values.expiryDate || undefined,
        issuerName: values.issuerName,
        templateId: selectedTemplate.id,
        // No custom data yet
      });
      
      // Then update to set status to pending
      try {
        await supabase
          .from('certificates')
          .update({ status: 'pending' })
          .eq('id', certificate.id);
      } catch (err) {
        console.error('Failed to mark certificate as pending:', err);
      }
      
      setPreviewCertificate({
        ...certificate,
        recipientName: values.recipientName,
        title: values.title,
        issueDate: values.issueDate,
        expiryDate: values.expiryDate,
        issuerName: values.issuerName,
      });
      
      setSavedCertificate(certificate);

      // Now automatically add the verification ID to custom fields
      setCustomFieldValues(prev => ({ 
        ...prev, 
        verification_id: certificate.certificationId 
      }));
      
      // Stay on step 1, but in a special "ID generated" state
      // We'll move to step 2 only when the user explicitly clicks the "Proceed to Step 2" button
      
      // Show verification ID prominently
      toast.success(
        <div className="font-medium">
          <div className="mb-1">Verification ID generated:</div>
          <div className="p-2 bg-green-100 border border-green-300 rounded text-center font-bold">
            {certificate.certificationId}
          </div>
          <div className="mt-1 text-sm">Press "View ID & Continue" button below</div>
        </div>,
        { duration: 8000 }
      );
      
    } catch (error) {
      toast.error("Failed to create certificate");
      console.error(error);
    } finally {
      setCreatingCertificateOnly(false);
    }
  };
  
  // Function to proceed to step 2 after certificate ID is generated
  const proceedToStepTwo = () => {
    if (!savedCertificate) {
      toast.error("Cannot proceed without certificate data");
      return;
    }
    setCurrentStep(2);
    toast.info("Now complete the custom fields and finalize your certificate");
  };

  // This is the main form submission handler (keep existing function)
  const onSubmit = async (values: FormValues) => {
    if (!selectedTemplate) {
      toast.error("No template selected");
      return;
    }

    // DEBUG: Log the custom field data before saving
    console.log('Custom Fields Debug:');
    console.log('- Custom Field Names:', customFieldNames);
    console.log('- Custom Field Values:', customFieldValues);
    console.log('- Custom Field Values isEmpty:', Object.keys(customFieldValues).length === 0);
    
    try {
      // Make sure customFieldValues is not empty
      if (Object.keys(customFieldValues).length === 0 && customFieldNames.length > 0) {
        toast.warning("Custom fields are empty. Please fill them out or they won't be saved.");
      }

      const certificate = await createCertificate({
        recipientName: values.recipientName,
        title: values.title,
        issueDate: values.issueDate,
        expiryDate: values.expiryDate || undefined,
        issuerName: values.issuerName,
        templateId: selectedTemplate.id,
        customData: customFieldValues,
      });
      
      form.reset();
      
      setPreviewCertificate({
        ...certificate,
        recipientName: values.recipientName,
        title: values.title,
        issueDate: values.issueDate,
        expiryDate: values.expiryDate,
        issuerName: values.issuerName,
      });
      
      setSavedCertificate(certificate);
      
      if (onSuccess) {
        onSuccess(certificate.certificationId);
      } else {
        toast.success(`Certificate created with ID: ${certificate.certificationId}`);
      }
    } catch (error) {
      toast.error("Failed to create certificate");
      console.error(error);
    } finally {
      setIsGeneratingPdf(false);
      setPdfGenerationResult({});
    }
  };

  const handleSelectTemplate = (template: CertificateTemplate) => {
    setSelectedTemplate(ensureTemplateHasMarkupGoId(template));
    toast.success(`Template "${template.name}" selected`);
  };

  const handleEditTemplate = (template: CertificateTemplate) => {
    setEditingTemplate(template);
  };

  const handleSaveTemplate = (templateData: CertificateTemplate) => {
    if (!templateData.name) {
      toast.error("Template name is required");
      return;
    }
    
    try {
      const templateToSave: CertificateTemplate = {
        id: editingTemplate ? editingTemplate.id : 'temp-id',
        name: templateData.name,
        createdAt: editingTemplate ? editingTemplate.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        styles: templateData.styles,
      };
      
      if (editingTemplate) {
        const updatedTemplate = ensureTemplateHasMarkupGoId({
          ...editingTemplate,
          ...templateToSave,
        });
        const updatedTemplates = templates.map(t => 
          t.id === updatedTemplate.id ? updatedTemplate : t
        );
        localStorage.setItem("aura_certificate_templates", JSON.stringify(updatedTemplates));
        setTemplates(updatedTemplates);
        setSelectedTemplate(updatedTemplate);
        setEditingTemplate(null);
      } else {
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

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldName]: value }));
    console.log(`Custom field "${fieldName}" updated to: "${value}"`);
  };

  // STEP 2: Finalize certificate - update custom data, activate certificate, and generate PDF
  const finalizeCertificateAndGeneratePdf = async () => {
    if (!savedCertificate || !selectedTemplate) {
      toast.error('Cannot finalize without certificate data and template');
      return;
    }

    setIsGeneratingPdf(true);
    setPdfGenerationResult({ success: null, message: 'Processing step 2...' });

    console.log('Finalizing certificate with custom data:', customFieldValues);
    
    // First update the certificate with custom data and activate it
    try {
      const { error: updateError } = await supabase
        .from('certificates')
        .update({ 
          custom_data: customFieldValues,
          status: 'active' // Activate the certificate in step 2
        })
        .eq('id', savedCertificate.id);
        
      if (updateError) {
        console.error('Failed to update and activate certificate:', updateError);
        toast.error('Failed to finalize certificate');
        setIsGeneratingPdf(false);
        return;
      }
      
      console.log('Certificate updated with custom data and activated');
      
      // Now generate the PDF
      console.log(`Calling backend generation for cert ID: ${savedCertificate.id} using template ID: ${selectedTemplate.markupgo_template_id}`);
      const result = await triggerBackendPdfGeneration(savedCertificate.id, selectedTemplate.markupgo_template_id);
      
      if (!result.success) {
        setPdfGenerationResult({ 
          success: false, 
          message: result.error || 'Failed to generate PDF'
        });
        setIsGeneratingPdf(false);
        return;
      }
      
      // Finally, update the certificate record with the PDF URL
      const { error: pdfUrlUpdateError } = await supabase
        .from('certificates')
        .update({ 
          public_pdf_url: result.pdfUrl
        })
        .eq('id', savedCertificate.id);
      
      if (pdfUrlUpdateError) {
        console.error('Failed to update certificate with PDF URL:', pdfUrlUpdateError);
      } else {
        console.log('Certificate successfully updated with PDF URL:', result.pdfUrl);
      }
      
      // Update result state with success and PDF URL
      setPdfGenerationResult({ 
        success: true, 
        message: 'Certificate finalized and PDF generated successfully!',
        pdfUrl: result.pdfUrl
      });
      
      toast.success(
        <div>
          <div className="font-semibold">Certificate Finalized!</div>
          <div className="text-sm mt-1">Certificate is now active and ready for verification</div>
        </div>
      );
      
    } catch (err) {
      console.error('Error in certificate finalization process:', err);
      toast.error('Failed to complete the certificate finalization process');
      setPdfGenerationResult({ 
        success: false, 
        message: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  
  // Legacy function - keep for compatibility or remove if not needed
  const handleGenerateAndCache = async () => {
    finalizeCertificateAndGeneratePdf();
  };

  // Show loading state if data is still loading or no template is selected
  if (loading) {
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
  
  // Check if we have a template selected
  if (!selectedTemplate) {
    return (
      <div className="p-6 border border-yellow-300 bg-yellow-50 rounded-md">
        <h3 className="font-medium text-lg mb-2">No template selected</h3>
        <p>Please select a template to continue.</p>
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
                  <CardTitle>Certificate Information</CardTitle>
                  <CardDescription>
                    Fill in the details for your certificate
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="recipientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Doe" 
                                {...field} 
                                disabled={currentStep > 1 || creatingCertificateOnly}
                                className={currentStep > 1 ? "bg-gray-100" : ""}
                              />
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
                              <Input 
                                placeholder="Advanced Security Certification" 
                                {...field}
                                disabled={currentStep > 1 || creatingCertificateOnly}
                                className={currentStep > 1 ? "bg-gray-100" : ""}
                              />
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
                              <Input 
                                type="date" 
                                {...field}
                                disabled={currentStep > 1 || creatingCertificateOnly}
                                className={currentStep > 1 ? "bg-gray-100" : ""}
                              />
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
                              <Input 
                                type="date" 
                                {...field}
                                disabled={currentStep > 1 || creatingCertificateOnly}
                                className={currentStep > 1 ? "bg-gray-100" : ""}
                              />
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
                              <Input 
                                placeholder="Department of Security" 
                                {...field}
                                disabled={currentStep > 1 || creatingCertificateOnly}
                                className={currentStep > 1 ? "bg-gray-100" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* STEP 1 BUTTON: Add a prominently visible button */}
                      {currentStep === 1 && !savedCertificate && (
                        <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-300 rounded-md">
                          <h3 className="text-center text-blue-600 font-bold mb-2 text-lg">Step 1: Generate Verification ID</h3>
                          <p className="text-sm text-center mb-3">Fill in the fields above and click the button below:</p>
                          <Button 
                            onClick={createCertificateOnly}
                            disabled={creatingCertificateOnly || !form.formState.isValid}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-4 text-lg font-bold"
                            type="button"
                          >
                            {creatingCertificateOnly ? "Processing..." : "GENERATE VERIFICATION ID"}
                          </Button>
                        </div>
                      )}
                      
                      {/* AFTER STEP 1: Show verification ID and continue button */}
                      {savedCertificate && currentStep === 1 && (
                        <div className="mt-8 p-4 bg-green-50 border-2 border-green-300 rounded-md">
                          <h3 className="text-center text-green-600 font-bold mb-2 text-lg">ID Generated Successfully!</h3>
                          <p className="text-sm text-center mb-2">Copy this verification ID for your records:</p>
                          <div className="p-3 mb-4 bg-white border-2 border-green-400 rounded text-center font-bold text-xl">
                            {savedCertificate.certificationId}
                          </div>
                          <Button 
                            onClick={proceedToStepTwo}
                            className="w-full bg-green-600 hover:bg-green-700 py-4 text-lg font-bold"
                            type="button"
                          >
                            CONTINUE TO STEP 2
                          </Button>
                        </div>
                      )}

                      {customFieldNames.length > 0 && (
                      <div className="pt-4 mt-4 border-t">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-md font-semibold">Custom Fields</h4>
                          {currentStep === 1 && (
                            <div className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded">
                              Complete Step 1 first to enable these fields
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          {customFieldNames.map(fieldName => (
                            <div key={fieldName}>
                              <FormLabel>
                                {fieldName.replace(/_/g, ' ')}
                                {fieldName === 'verification_id' && (
                                  <span className="ml-2 text-xs text-blue-500">
                                    (Auto-filled after Step 1)
                                  </span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  value={customFieldValues[fieldName] || ''}
                                  onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
                                  className={`${fieldName === 'verification_id' ? 'border-blue-300' : ''} ${currentStep === 1 ? 'bg-gray-100' : ''}`}
                                  disabled={currentStep === 1 || isGeneratingPdf}
                                />
                              </FormControl>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No buttons here - they're all in the card at the bottom */}
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <div className="w-full overflow-auto">
              <h3 className="text-lg font-medium mb-4">Certificate Preview</h3>
              <div className="scale-[0.6] origin-top-left transform">
                {selectedTemplate && (
                  <CertificatePreview
                    certificate={{
                      id: "preview",
                      recipientName: form.getValues().recipientName || "Recipient Name",
                      title: form.getValues().title || "Certificate Title",
                      issueDate: form.getValues().issueDate || new Date().toISOString(),
                      expiryDate: form.getValues().expiryDate,
                      issuerName: form.getValues().issuerName || "Issuer Name",
                      certificationId: "XXXX-XXXX-XXXX",
                      status: "active" as const,
                    }}
                    template={selectedTemplate}
                  />
                )}
              </div>
            </div>
          </div>
          
          {savedCertificate && (
            <Card className="mt-6 glass">
              <CardHeader>
                <CardTitle>Certificate Finalization</CardTitle>
                <CardDescription>
                  Complete the 2-step certificate creation process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Step progress indicator */}
                  <div className="flex mb-6 w-full">
                    <div className={`flex-1 text-center p-2 rounded-l-md border ${currentStep >= 1 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'}`}>
                      <div className="font-medium">Step 1</div>
                      <div className="text-sm">Generate ID</div>
                    </div>
                    <div className={`flex-1 text-center p-2 rounded-r-md border ${currentStep >= 2 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'}`}>
                      <div className="font-medium">Step 2</div>
                      <div className="text-sm">Complete & Activate</div>
                    </div>
                  </div>
                  
                  {/* Verification ID display (if available) */}
                  {savedCertificate && savedCertificate.certificationId && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="text-sm font-medium mb-1">Verification ID:</div>
                      <div className="p-2 bg-white border border-green-300 rounded text-center font-bold">
                        {savedCertificate.certificationId}
                      </div>
                    </div>
                  )}
                  
                  {/* Debug: Display certificate existence for troubleshooting */}
                  <div className="text-xs text-gray-500 mb-2">
                    Certificate ID: {savedCertificate?.certificationId || "Not generated yet"}
                  </div>
                  
                  {/* Button for current step */}
                  {currentStep === 1 && !savedCertificate && (
                    // Initial state - generate the certificate
                    <Button 
                      onClick={createCertificateOnly}
                      disabled={creatingCertificateOnly || !form.formState.isValid}
                      className="w-full bg-blue-600 hover:bg-blue-700 mb-2"
                    >
                      {creatingCertificateOnly ? "Processing..." : "Step 1: Generate Verification ID"}
                    </Button>
                  )}
                  
                  {savedCertificate && currentStep === 1 && (
                    // Certificate has been created but we're still on step 1 - show button to proceed
                    <Button 
                      onClick={proceedToStepTwo}
                      className="w-full bg-green-600 hover:bg-green-700 mb-2"
                    >
                      View ID & Continue to Step 2
                    </Button>
                  )}
                  
                  {currentStep === 2 && (
                    <Button 
                      onClick={finalizeCertificateAndGeneratePdf} 
                      disabled={isGeneratingPdf || !savedCertificate}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isGeneratingPdf ? "Finalizing..." : "Step 2: Complete & Activate Certificate"}
                    </Button>
                  )}
                  
                  {/* Result message */}
                  {pdfGenerationResult.success !== undefined && (
                    <div className={`p-3 rounded-md ${pdfGenerationResult.success ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
                      <p className="font-medium mb-1">{pdfGenerationResult.success ? 'Success!' : 'Error:'}</p>
                      <p className="text-sm">{pdfGenerationResult.message}</p>
                      
                      {pdfGenerationResult.pdfUrl && (
                        <div className="mt-3">
                          <a 
                            href={pdfGenerationResult.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                          >
                            View Certificate PDF
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
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
                  styles: selectedTemplate?.styles,
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

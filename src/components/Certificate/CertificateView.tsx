import React, { useState, useEffect, useRef } from 'react';
import { Certificate } from '@/types/Certificate';
import { CertificateTemplate } from '@/types/CertificateTemplate';
import { CertificatePreview } from './CertificatePreview';
import { getTemplateById } from '@/services/templateService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Download, ExternalLink, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { generatePdfFromMarkupGo } from '@/services/markupGoService';

interface CertificateViewProps {
  certificate: Certificate;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate }) => {
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [directViewMode, setDirectViewMode] = useState(false);
  
  console.log('CertificateView received certificate:', certificate);
  
  // Extract and process the PDF URL directly
  let pdfUrl = certificate?.publicPdfUrl || '';
  console.log('Raw Certificate PDF URL:', pdfUrl);
  
  // Clean the URL if needed
  if (pdfUrl) {
    pdfUrl = pdfUrl.trim();
    // Ensure it starts with http:// or https://
    if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
      pdfUrl = `https://${pdfUrl}`;
    }
  }
  
  // For debugging and status check
  useEffect(() => {
    console.log('Processed PDF URL:', pdfUrl);
    setLoading(true);
    setPdfError(false);
    
    if (pdfUrl) {
      // Set direct view mode by default since we're likely to hit CORS issues
      setDirectViewMode(true);
      
      // Still try to check if URL is accessible, but we won't rely on this
      fetch(pdfUrl, { method: 'HEAD', mode: 'no-cors' })
        .then(response => {
          console.log('PDF URL check attempted, status:', response.type);
          // We can't actually check status with no-cors mode, but at least we can see if URL responds
        })
        .catch(err => {
          console.error('Error checking PDF URL:', err);
          setPdfError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setPdfError(true);
    }
  }, [pdfUrl]);
  
  const isPdfAvailable = Boolean(pdfUrl && pdfUrl.length > 0);
  
  // Force download the PDF file
  const handleDownloadClick = () => {
    if (!pdfUrl) {
      toast.error("No PDF URL available");
      return;
    }
    
    toast.loading("Starting download...");
    console.log('Force downloading PDF from:', pdfUrl);
    
    // Method 1: Direct download through iframe
    try {
      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Create a form within the iframe for a POST request
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = pdfUrl;
      
      // Add hidden field to prompt download
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'download';
      hiddenField.value = 'true';
      form.appendChild(hiddenField);
      
      // Add form to iframe and submit
      iframe.contentDocument?.body.appendChild(form);
      form.submit();
      
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(iframe);
        toast.dismiss();
        toast.success("Download initiated");
      }, 2000);
      
    } catch (error) {
      console.error("Error in download method 1:", error);
      
      // Method 2: Fallback to simpler approach
      try {
        const filename = `certificate-${certificate.recipientName.replace(/\s+/g, '_')}-${certificate.id}.pdf`;
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = filename;
        link.target = '_blank'; // Important for CORS
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.dismiss();
        toast.success("Download initiated");
      } catch (secondError) {
        console.error("Error in download method 2:", secondError);
        toast.dismiss();
        toast.error("Could not download. Try right-clicking and 'Save link as' instead.");
        
        // Method 3: Last resort, just open in new window
        window.open(pdfUrl, '_blank');
      }
    }
  };
  
  // Function to open PDF in new tab - without triggering download
  const openInNewTab = () => {
    if (!pdfUrl) {
      toast.error("No PDF URL available");
      return;
    }
    
    console.log('Opening PDF in new tab:', pdfUrl);
    
    // Create a new tab with the PDF URL
    const newTab = window.open('about:blank', '_blank');
    if (newTab) {
      newTab.location.href = pdfUrl;
      toast.success("Opening PDF in new tab");
    } else {
      // Fallback if popup is blocked
      toast.error("Pop-up blocked. Please allow pop-ups for this site.");
      // Provide a direct link the user can click
      console.log('Direct PDF link:', pdfUrl);
    }
  };

  return (
    <div className="space-y-6">
      {isPdfAvailable ? (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="min-h-[300px] w-full border rounded-lg overflow-hidden relative">
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="text-center space-y-6 max-w-md">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mb-8">
                  <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Certificate Available</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    This certificate has been verified and is ready to download or view.
                  </p>
                  
                  <div className="mt-4 space-y-2 text-left text-sm">
                    <p><strong>Recipient:</strong> {certificate.recipientName}</p>
                    <p><strong>Certificate:</strong> {certificate.title}</p>
                    <p><strong>Issued:</strong> {new Date(certificate.issueDate).toLocaleDateString()}</p>
                    <p><strong>Verification ID:</strong> {certificate.certificationId}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
                  <Button 
                    onClick={handleDownloadClick}
                    className="font-medium h-12 px-6 bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                    title="Download PDF"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Certificate
                  </Button>
                  <Button 
                    onClick={openInNewTab} 
                    variant="outline"
                    className="font-medium h-12 px-6"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View in Browser
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                <div className="text-center">
                  <Skeleton className="h-8 w-32 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Verifying certificate...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-100 rounded-lg">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Certificate PDF Not Found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            We couldn't find the PDF for this certificate. This may be because the certificate was recently created.
          </p>
          
          {/* Direct URL attempt if we have it */}
          {certificate.publicPdfUrl && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Try opening the certificate directly:</p>
              <Button 
                onClick={openInNewTab}
                className="font-medium mx-auto"
              >
                <ExternalLink className="mr-2 h-4 w-4" />Open Certificate
              </Button>
            </div>
          )}
          
          {/* Certificate info */}
          <div className="p-6 border border-gray-200 rounded-lg bg-white max-w-md mx-auto">
            <h4 className="font-medium mb-2">Certificate Information:</h4>
            <div className="text-sm text-left space-y-2">
              <p><strong>Recipient:</strong> {certificate.recipientName}</p>
              <p><strong>Title:</strong> {certificate.title}</p>
              <p><strong>Issued By:</strong> {certificate.issuerName}</p>
              <p><strong>Issue Date:</strong> {new Date(certificate.issueDate).toLocaleDateString()}</p>
              <p><strong>Verification ID:</strong> {certificate.certificationId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React from "react";
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
import { toast } from "sonner";

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

  const onSubmit = (values: FormValues) => {
    try {
      const certificate = createCertificate(values);
      form.reset();
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

  return (
    <Card className="w-full max-w-2xl mx-auto glass">
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

            <Button type="submit" className="w-full">
              Create Certificate
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CertificateForm;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { CertificateTemplate } from "../../types/CertificateTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  markupgo_template_id: z.string().min(1, "MarkupGo Template ID is required"),
  styles: z.object({
    backgroundColor: z.string(),
    backgroundImage: z.string().optional(),
    borderStyle: z.string(),
    borderColor: z.string(),
    borderWidth: z.string(),
    width: z.string(),
    height: z.string(),
    fontFamily: z.string(),
    titleStyles: z.object({
      fontSize: z.string(),
      fontWeight: z.string(),
      color: z.string(),
      textAlign: z.string(),
      marginTop: z.string(),
      marginBottom: z.string(),
    }),
    recipientStyles: z.object({
      fontSize: z.string(),
      fontWeight: z.string(),
      color: z.string(),
      textAlign: z.string(),
      marginTop: z.string(),
      marginBottom: z.string(),
    }),
    issuerStyles: z.object({
      fontSize: z.string(),
      fontWeight: z.string(),
      color: z.string(),
      textAlign: z.string(),
      marginTop: z.string(),
      marginBottom: z.string(),
    }),
    dateStyles: z.object({
      fontSize: z.string(),
      fontWeight: z.string(),
      color: z.string(),
      textAlign: z.string(),
      marginTop: z.string(),
      marginBottom: z.string(),
    }),
    descriptionStyles: z.object({
      fontSize: z.string(),
      fontWeight: z.string(),
      color: z.string(),
      textAlign: z.string(),
      marginTop: z.string(),
      marginBottom: z.string(),
    }),
    logoStyles: z.object({
      width: z.string(),
      height: z.string(),
      position: z.enum(["top", "bottom", "left", "right"]),
      margin: z.string(),
    }),
    signatureStyles: z.object({
      width: z.string(),
      height: z.string(),
      position: z.enum(["bottom"]),
      margin: z.string(),
    }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface TemplateEditorProps {
  template: CertificateTemplate;
  onSave: (template: Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt">) => void;
}

const fontFamilies = [
  "Georgia, serif",
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "Times New Roman, serif",
  "Courier New, monospace",
];

const fontWeights = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

const borderStyles = [
  "none",
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
];

const textAligns = ["left", "center", "right", "justify"];

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template.name,
      description: template.description || "",
      markupgo_template_id: template.markupgo_template_id || "",
      styles: template.styles,
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      onSave(values as Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt">);
      toast.success("Template saved");
    } catch (error) {
      toast.error("Failed to save template");
      console.error(error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Certificate Template Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Certificate Template" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="markupgo_template_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MarkupGo Template ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the ID from markupgo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Certificate for professional training completion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="general">
                  <AccordionTrigger>General Style</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="styles.backgroundColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input type="color" {...field} className="w-12 h-10 p-1" />
                              </FormControl>
                              <Input 
                                value={field.value} 
                                onChange={field.onChange} 
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="styles.width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width</FormLabel>
                            <FormControl>
                              <Input placeholder="800px" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="styles.height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height</FormLabel>
                            <FormControl>
                              <Input placeholder="600px" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="styles.fontFamily"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Font Family</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select font family" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fontFamilies.map(font => (
                                  <SelectItem key={font} value={font}>
                                    {font.split(",")[0]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="border">
                  <AccordionTrigger>Border</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="styles.borderStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Border Style</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select border style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {borderStyles.map(style => (
                                  <SelectItem key={style} value={style}>
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="styles.borderColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Border Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input type="color" {...field} className="w-12 h-10 p-1" />
                              </FormControl>
                              <Input 
                                value={field.value} 
                                onChange={field.onChange} 
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="styles.borderWidth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Border Width</FormLabel>
                            <FormControl>
                              <Input placeholder="3px" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="title">
                  <AccordionTrigger>Title Styling</AccordionTrigger>
                  <AccordionContent>
                    <StyleFieldSet 
                      form={form} 
                      path="styles.titleStyles" 
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="recipient">
                  <AccordionTrigger>Recipient Name Styling</AccordionTrigger>
                  <AccordionContent>
                    <StyleFieldSet 
                      form={form} 
                      path="styles.recipientStyles" 
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="issuer">
                  <AccordionTrigger>Issuer Styling</AccordionTrigger>
                  <AccordionContent>
                    <StyleFieldSet 
                      form={form} 
                      path="styles.issuerStyles" 
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="date">
                  <AccordionTrigger>Date Styling</AccordionTrigger>
                  <AccordionContent>
                    <StyleFieldSet 
                      form={form} 
                      path="styles.dateStyles" 
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="description">
                  <AccordionTrigger>Description Styling</AccordionTrigger>
                  <AccordionContent>
                    <StyleFieldSet 
                      form={form} 
                      path="styles.descriptionStyles" 
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <Button type="submit" className="w-full">Save Template</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Helper component for text styling fields
interface StyleFieldSetProps {
  form: any;
  path: string;
}

const StyleFieldSet: React.FC<StyleFieldSetProps> = ({ form, path }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={`${path}.fontSize`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Font Size</FormLabel>
            <FormControl>
              <Input placeholder="16px" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${path}.fontWeight`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Font Weight</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select font weight" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fontWeights.map(weight => (
                  <SelectItem key={weight} value={weight}>
                    {weight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${path}.color`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Text Color</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input type="color" {...field} className="w-12 h-10 p-1" />
              </FormControl>
              <Input 
                value={field.value} 
                onChange={field.onChange} 
                className="flex-1"
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${path}.textAlign`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Text Align</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select text alignment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {textAligns.map(align => (
                  <SelectItem key={align} value={align}>
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${path}.marginTop`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Margin Top</FormLabel>
            <FormControl>
              <Input placeholder="10px" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${path}.marginBottom`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Margin Bottom</FormLabel>
            <FormControl>
              <Input placeholder="10px" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TemplateEditor;

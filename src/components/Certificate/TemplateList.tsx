
import React from "react";
import { CertificateTemplate } from "../../types/CertificateTemplate";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface TemplateListProps {
  templates: CertificateTemplate[];
  onSelect: (template: CertificateTemplate) => void;
  onEdit: (template: CertificateTemplate) => void;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onSelect,
  onEdit,
  onDelete,
  onClone,
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No templates found.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="glass">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{template.name}</CardTitle>
            <CardDescription>
              Last updated: {formatDate(template.updatedAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {template.description && <p className="text-sm mb-2">{template.description}</p>}
            <div 
              className="w-full h-32 border rounded overflow-hidden"
              style={{
                backgroundColor: template.styles.backgroundColor,
                borderColor: template.styles.borderColor,
                borderWidth: template.styles.borderWidth,
                borderStyle: template.styles.borderStyle,
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <p style={{ 
                  fontFamily: template.styles.fontFamily,
                  fontSize: template.styles.titleStyles.fontSize,
                  color: template.styles.titleStyles.color 
                }}>
                  Preview
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onSelect(template)}
            >
              Use
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(template)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClone(template.id)}
            >
              Clone
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(template.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TemplateList;

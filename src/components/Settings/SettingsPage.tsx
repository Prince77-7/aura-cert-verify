import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  saveMarkupGoApiKey, 
  getMarkupGoApiKey, 
  saveCustomFieldNames, 
  getCustomFieldNames,
  saveMarkupGoTemplateId, 
  getMarkupGoTemplateId 
} from '@/services/settingsService';
import { X } from 'lucide-react'; // Icon for remove button

// Helper function to recursively extract keys from JSON, handling nesting
const extractKeysFromJson = (obj: any, prefix = ''): string[] => {
  let keys: string[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively call for nested objects (excluding arrays)
        keys = keys.concat(extractKeysFromJson(obj[key], newKey));
      } else {
        keys.push(newKey);
      }
    }
  }
  return keys;
};

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [templateId, setTemplateId] = useState<string>('');
  const [jsonInput, setJsonInput] = useState<string>(''); // State for JSON input textarea

  useEffect(() => {
    const existingKey = getMarkupGoApiKey();
    if (existingKey) {
      setApiKey(existingKey);
    }
    const existingFields = getCustomFieldNames();
    setCustomFields(existingFields);
    const existingTemplateId = getMarkupGoTemplateId();
    if (existingTemplateId) {
      setTemplateId(existingTemplateId);
    }
  }, []);

  const handleSaveApiKey = () => {
    saveMarkupGoApiKey(apiKey);
    toast.success('MarkupGo API Key saved!');
  };

  const handleSaveTemplateId = () => {
    saveMarkupGoTemplateId(templateId);
    toast.success('MarkupGo Template ID saved!');
  };

  const handleAddField = () => {
    const trimmedName = newFieldName.trim();
    if (!trimmedName) {
      toast.error("Field name cannot be empty.");
      return;
    }
    if (/\s/.test(trimmedName)) {
        toast.error("Field name should not contain spaces. Use underscores (_) or camelCase.");
        return;
    }
    if (customFields.includes(trimmedName)) {
      toast.warning(`Field "${trimmedName}" already exists.`);
      return;
    }
    const updatedFields = [...customFields, trimmedName];
    setCustomFields(updatedFields);
    saveCustomFieldNames(updatedFields);
    setNewFieldName(''); 
    toast.success(`Custom field "${trimmedName}" added.`);
  };

  const handleRemoveField = (fieldNameToRemove: string) => {
    const updatedFields = customFields.filter(name => name !== fieldNameToRemove);
    setCustomFields(updatedFields);
    saveCustomFieldNames(updatedFields);
    toast.success(`Custom field "${fieldNameToRemove}" removed.`);
  };

  const handleImportFromJson = () => {
    if (!jsonInput.trim()) {
      toast.info('Please paste JSON data into the text area first.');
      return;
    }
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (typeof parsedJson !== 'object' || parsedJson === null || Array.isArray(parsedJson)) {
        toast.error('Invalid JSON structure. Please provide a JSON object.');
        return;
      }

      const extracted = extractKeysFromJson(parsedJson);
      
      // Combine with existing fields, removing duplicates
      const updatedFields = [...new Set([...customFields, ...extracted])];

      if (updatedFields.length > customFields.length) {
        setCustomFields(updatedFields);
        saveCustomFieldNames(updatedFields);
        toast.success(`Imported ${updatedFields.length - customFields.length} new field(s) from JSON.`);
        setJsonInput(''); // Clear textarea after successful import
      } else {
        toast.info('No new fields found in the provided JSON.');
      }

    } catch (error) {
      console.error("Error parsing JSON:", error);
      toast.error('Failed to parse JSON. Please check the format.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-6 max-w-md">
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold">MarkupGo Integration</h3>
          <div className="space-y-2">
            <Label htmlFor="markupgo-api-key">MarkupGo API Key</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="markupgo-api-key"
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your MarkupGo API Key"
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey}>Save Key</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your API key is stored locally in your browser.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="markupgo-template-id">MarkupGo Template ID</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="markupgo-template-id"
                type="text"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                placeholder="Enter your default MarkupGo Template ID"
                className="flex-1"
              />
              <Button onClick={handleSaveTemplateId}>Save ID</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The ID of the template created on markupgo.com to use for generation.
            </p>
          </div>
        </div>
        
        <div className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Custom Certificate Fields</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Define the data fields (using `.` for nesting, e.g., `ceo.name`) your MarkupGo template expects. These will be sent in the API call.
          </p>
          {/* Add New Field Input */}
          <div className="flex items-center space-x-2 mb-4">
            <Input
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Enter new field name (e.g., achievement_details)"
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddField()} 
            />
            <Button onClick={handleAddField}>Add Field</Button>
          </div>

          {/* Existing Fields List */}
          <div className="space-y-2 mb-6">
            {customFields.map((field, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded">
                <span className="text-sm">{field}</span>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveField(field)} title={`Remove ${field}`}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {customFields.length === 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              No custom fields defined yet.
            </p>
          )}

          {/* --- JSON Import Section --- */}
          <div className="space-y-2 border-t pt-6 mt-6">
            <Label htmlFor="json-import">Import Fields from Sample JSON</Label>
            <Textarea
              id="json-import"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste a sample JSON payload here (e.g., { "name": "John Doe", "course": { "title": "Intro" } })'
              rows={5}
              className="mb-2"
            />
            <Button onClick={handleImportFromJson} variant="outline" size="sm">
                Import Fields from JSON
            </Button>
            <p className="text-sm text-muted-foreground">
              Extracts all keys (including nested ones like `object.key`) from the JSON and adds them to the list above.
            </p>
          </div>
           {/* --- End JSON Import Section --- */}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

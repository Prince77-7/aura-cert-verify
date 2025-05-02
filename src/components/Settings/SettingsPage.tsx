
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
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  const { isAuthenticated } = useAuth();
  const [apiKey, setApiKey] = useState<string>('');
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [templateId, setTemplateId] = useState<string>('');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const existingKey = await getMarkupGoApiKey();
        if (existingKey) {
          setApiKey(existingKey);
        }
        
        const existingFields = await getCustomFieldNames();
        setCustomFields(existingFields);
        
        const existingTemplateId = await getMarkupGoTemplateId();
        if (existingTemplateId) {
          setTemplateId(existingTemplateId);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [isAuthenticated]);

  const handleSaveApiKey = async () => {
    try {
      await saveMarkupGoApiKey(apiKey);
      toast.success('MarkupGo API Key saved!');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    }
  };

  const handleSaveTemplateId = async () => {
    try {
      await saveMarkupGoTemplateId(templateId);
      toast.success('MarkupGo Template ID saved!');
    } catch (error) {
      console.error('Error saving template ID:', error);
      toast.error('Failed to save template ID');
    }
  };

  const handleAddField = async () => {
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
    
    try {
      const updatedFields = [...customFields, trimmedName];
      await saveCustomFieldNames(updatedFields);
      setCustomFields(updatedFields);
      setNewFieldName(''); 
      toast.success(`Custom field "${trimmedName}" added.`);
    } catch (error) {
      console.error('Error adding field:', error);
      toast.error('Failed to add field');
    }
  };

  const handleRemoveField = async (fieldNameToRemove: string) => {
    try {
      const updatedFields = customFields.filter(name => name !== fieldNameToRemove);
      await saveCustomFieldNames(updatedFields);
      setCustomFields(updatedFields);
      toast.success(`Custom field "${fieldNameToRemove}" removed.`);
    } catch (error) {
      console.error('Error removing field:', error);
      toast.error('Failed to remove field');
    }
  };

  const handleImportFromJson = async () => {
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
        try {
          await saveCustomFieldNames(updatedFields);
          setCustomFields(updatedFields);
          toast.success(`Imported ${updatedFields.length - customFields.length} new field(s) from JSON.`);
          setJsonInput(''); // Clear textarea after successful import
        } catch (error) {
          console.error('Error saving imported fields:', error);
          toast.error('Failed to save imported fields');
        }
      } else {
        toast.info('No new fields found in the provided JSON.');
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      toast.error('Failed to parse JSON. Please check the format.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          <span className="ml-3">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {!isAuthenticated && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mb-6 border border-yellow-200 dark:border-yellow-900">
          <p className="text-yellow-800 dark:text-yellow-300">
            You are not logged in. Settings will be saved locally in your browser. 
            To sync settings across devices, please log in.
          </p>
        </div>
      )}

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
              {isAuthenticated 
                ? "Your API key is stored securely in your account." 
                : "Your API key is stored locally in your browser."}
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
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

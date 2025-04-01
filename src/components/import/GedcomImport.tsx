import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FileText,
  Loader2,
  Users
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { GedcomParser } from '@/lib/gedcom';
import { useImportGedcomMutation } from '@/lib/api';
import { Progress } from '@/components/ui/progress';

const GedcomImport: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.name.toLowerCase().endsWith('.ged')) {
        setFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a GEDCOM file (.ged)",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-gedcom': ['.ged'],
    },
    maxFiles: 1,
  });

  const handleImport = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(0);

      // Parse GEDCOM file
      const parser = new GedcomParser();
      const data = await parser.parse(file);
      setProgress(50);

      // Import data
      await importGedcom(data);
      setProgress(100);

      toast({
        title: "Success",
        description: "GEDCOM file imported successfully",
      });

      // Reset state
      setFile(null);
      setProgress(0);
    } catch (error) {
      console.error('Error importing GEDCOM:', error);
      toast({
        title: "Error",
        description: "Failed to import GEDCOM file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Users className="h-4 w-4 text-cyber-accent mr-2" />
          {t('import_gedcom')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-cyber-accent bg-cyber-accent/10'
              : 'border-cyber-border hover:border-cyber-accent'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <p className="text-lg">{t('drop_gedcom')}</p>
            <p className="text-sm text-muted-foreground">
              {file ? file.name : 'No file selected'}
            </p>
          </div>
        </div>

        {file && (
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setFile(null)}
                disabled={isProcessing}
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={handleImport}
                disabled={isProcessing}
                className="bg-cyber-accent hover:bg-cyber-accent/80"
              >
                {isProcessing ? 'Processing...' : t('import')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GedcomImport; 
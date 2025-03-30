import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FileText, 
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface FileDropZoneProps {
  onAddToBio: (text: string) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onAddToBio }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    }
  });
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const handleFileUpload = () => {
    if (files.length === 0) return;
    
    toast({
      title: language === 'fr' ? 'Fichiers téléchargés' : 'Files Uploaded',
      description: language === 'fr' 
        ? 'Les fichiers ont été téléchargés avec succès.' 
        : 'Files have been successfully uploaded.',
    });
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Upload className="h-4 w-4 mr-2" /> 
          {t('documents')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/30'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            {isDragActive 
              ? (language === 'fr' ? 'Déposez les fichiers ici...' : 'Drop the files here...') 
              : t('drop_files')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'fr' 
              ? 'Formats acceptés: JPG, PNG, PDF, TXT' 
              : 'Accepted formats: JPG, PNG, PDF, TXT'}
          </p>
        </div>
        
        {files.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">{language === 'fr' ? 'Fichiers' : 'Files'}</div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-md border border-gray-200"
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full mt-3" 
              onClick={handleFileUpload}
            >
              {language === 'fr' ? 'Télécharger les fichiers' : 'Upload Files'}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-3">
        <p>
          {language === 'fr' 
            ? 'Les fichiers seront attachés au profil.' 
            : 'Files will be attached to the profile.'}
        </p>
      </CardFooter>
    </Card>
  );
};

export default FileDropZone;

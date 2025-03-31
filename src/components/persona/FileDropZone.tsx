import React, { useState, useCallback } from 'react';
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
  X, 
  User, 
  UserPlus,
  Check, 
  Brain 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

// Mock OCR function - in a real app, this would call a proper OCR service
const mockOcrAnalysis = async (file: File): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock OCR results for different file types
  if (file.name.includes('letter')) {
    return "Dear John, I hope this letter finds you well. I wanted to share with you that I have moved to Paris for work. The company has offered me a position at their headquarters. Life here is different but exciting. I hope to see you soon. Best regards, Emily";
  } else if (file.name.includes('certificate')) {
    return "BIRTH CERTIFICATE\nName: John Smith\nDate of Birth: April 12, 1950\nPlace of Birth: Boston, Massachusetts\nFather: James Smith\nMother: Mary Johnson";
  } else {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed nec justo ut erat consequat rhoncus. Praesent placerat, mauris non ultricies gravida.";
  }
};

// Extract key information from OCR text
const extractKeyInfo = (text: string): string[] => {
  // This is a simple implementation - in a real app, this would be more sophisticated
  const lines = text.split('\n');
  const keyInfo: string[] = [];
  
  // Look for patterns like dates, locations, names, etc.
  lines.forEach(line => {
    if (line.includes('Date') || line.includes('Born') || line.includes('Birth')) {
      keyInfo.push(line.trim());
    } else if (line.includes('Place') || line.includes('Location') || line.includes('Address')) {
      keyInfo.push(line.trim());
    } else if (line.includes('Name') || line.includes('Father') || line.includes('Mother')) {
      keyInfo.push(line.trim());
    }
  });
  
  // If we didn't find specific key info, just return first 2-3 sentences
  if (keyInfo.length === 0) {
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
    return sentences.slice(0, Math.min(3, sentences.length)).map(s => s.trim() + '.');
  }
  
  return keyInfo;
};

interface FileDropZoneProps {
  onAddToBio: (text: string) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onAddToBio }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [ocrResults, setOcrResults] = useState<Record<string, string>>({});
  const [keyTakeaways, setKeyTakeaways] = useState<Record<string, string[]>>({});
  const [tagType, setTagType] = useState<'author' | 'receiver'>('author');
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
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
    const fileName = newFiles[index].name;
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // Also remove OCR results if they exist
    if (ocrResults[fileName]) {
      const newResults = { ...ocrResults };
      delete newResults[fileName];
      setOcrResults(newResults);
      
      const newTakeaways = { ...keyTakeaways };
      delete newTakeaways[fileName];
      setKeyTakeaways(newTakeaways);
    }
  };
  
  const processFiles = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      const newResults: Record<string, string> = {};
      const newTakeaways: Record<string, string[]> = {};
      
      // Process each file with OCR
      for (const file of files) {
        if (!ocrResults[file.name]) {
          const result = await mockOcrAnalysis(file);
          newResults[file.name] = result;
          newTakeaways[file.name] = extractKeyInfo(result);
        }
      }
      
      setOcrResults(prev => ({ ...prev, ...newResults }));
      setKeyTakeaways(prev => ({ ...prev, ...newTakeaways }));
      
      toast({
        title: language === 'fr' ? 'Analyse OCR terminée' : 'OCR Analysis Complete',
        description: language === 'fr' 
          ? 'Tous les fichiers ont été analysés avec succès.' 
          : 'All files have been successfully analyzed.',
      });
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr'
          ? "Une erreur s'est produite lors de l'analyse des fichiers."
          : "An error occurred while analyzing the files."
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleAddToBio = (text: string) => {
    onAddToBio(text);
    toast({
      title: language === 'fr' ? 'Ajouté à la biographie' : 'Added to Biography',
      description: language === 'fr'
        ? 'Le texte a été ajouté à la biographie.'
        : 'The text has been added to the biography.'
    });
  };
  
  return (
    <Card className="cyber-card mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Upload className="h-4 w-4 text-cyber-accent mr-2" /> 
          {t('documents')} & {t('ocr_analysis')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-cyber-accent bg-cyber-accent/5' 
              : 'border-cyber-border/50 hover:border-cyber-accent/30'
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
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">{language === 'fr' ? 'Fichiers' : 'Files'}</div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs ${tagType === 'author' ? 'bg-cyber-accent/20 border-cyber-accent/50' : ''}`}
                  onClick={() => setTagType('author')}
                >
                  <User className="h-3 w-3 mr-1" /> {t('author')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs ${tagType === 'receiver' ? 'bg-cyber-accent/20 border-cyber-accent/50' : ''}`}
                  onClick={() => setTagType('receiver')}
                >
                  <UserPlus className="h-3 w-3 mr-1" /> {t('receiver')}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-cyber-dark rounded-md border border-cyber-border/30"
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-cyber-accent mr-2" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    {ocrResults[file.name] && (
                      <Check className="h-4 w-4 text-green-500 ml-2" />
                    )}
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
              onClick={processFiles}
              disabled={uploading || Object.keys(ocrResults).length === files.length}
            >
              {uploading 
                ? (language === 'fr' ? 'Analyse en cours...' : 'Analyzing...') 
                : (language === 'fr' ? 'Analyser les fichiers' : 'Analyze Files')}
            </Button>
          </div>
        )}
        
        {Object.keys(ocrResults).length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">{t('suggested_takeaways')}</h3>
            <div className="space-y-4">
              {Object.entries(keyTakeaways).map(([fileName, takeaways]) => (
                <div key={fileName} className="bg-cyber-dark/50 p-3 rounded-md border border-cyber-border/30">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-cyber-accent mr-2" />
                      <span className="text-sm font-medium">{fileName}</span>
                    </div>
                    <div className="text-xs px-2 py-0.5 bg-cyber-accent/20 rounded text-cyber-accent">
                      {tagType === 'author' ? t('author') : t('receiver')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {takeaways.map((item, i) => (
                      <div key={i} className="flex justify-between items-center group">
                        <p className="text-sm text-muted-foreground">{item}</p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleAddToBio(item)}
                        >
                          <Plus className="h-3 w-3" /> {t('add_to_bio')}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-cyber-border/30 flex justify-between">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-xs text-cyber-accent p-0"
                      onClick={() => {
                        // In a real app, this would open a modal with full OCR results
                        toast({
                          title: language === 'fr' ? 'Texte complet' : 'Full Text',
                          description: ocrResults[fileName].substring(0, 100) + '...'
                        });
                      }}
                    >
                      {language === 'fr' ? 'Voir le texte complet' : 'View full text'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleAddToBio(takeaways.join(' '))}
                    >
                      {t('add_all')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground border-t border-cyber-border/30 pt-3">
        <div className="flex items-center">
          <Brain className="h-3 w-3 mr-1" />
          {language === 'fr' 
            ? 'Alimenté par la technologie OCR avancée' 
            : 'Powered by advanced OCR technology'}
        </div>
      </CardFooter>
    </Card>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default FileDropZone;

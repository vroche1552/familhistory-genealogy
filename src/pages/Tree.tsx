
import Navbar from '@/components/layout/Navbar';
import FamilyTree from '@/components/tree/FamilyTree';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Upload, 
  Share2, 
  PlusCircle,
  Save
} from 'lucide-react';

const Tree = () => {
  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        {/* Tree Controls */}
        <div className="bg-cyber-dark border-b border-cyber-border/30 p-4">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl font-semibold cyber-text-gradient mb-4 sm:mb-0">Family Tree Builder</h1>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" className="cyber-button">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Person
              </Button>
              <Button variant="outline" size="sm" className="cyber-button">
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button variant="outline" size="sm" className="cyber-button">
                <Upload className="h-4 w-4 mr-2" /> Import
              </Button>
              <Button variant="outline" size="sm" className="cyber-button">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button variant="outline" size="sm" className="cyber-button">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tree Visualization */}
        <div className="flex-grow p-4">
          <FamilyTree />
        </div>
      </main>
    </div>
  );
};

export default Tree;

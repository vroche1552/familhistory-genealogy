
import Navbar from '@/components/layout/Navbar';
import FamilyTree from '@/components/tree/FamilyTree';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Upload, 
  Share2, 
  PlusCircle,
  Save,
  Users,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const Tree = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        {/* Tree Controls */}
        <div className="bg-gray-100 border-b border-gray-200 p-4">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl font-semibold text-black mb-4 sm:mb-0 flex items-center">
              <Users className="h-5 w-5 inline-block mr-2 text-gray-600" />
              {t('family_tree_builder')}
            </h1>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="mr-2">
                <Input 
                  type="text" 
                  placeholder={t('search')} 
                  className="h-9 bg-white border-gray-300 text-sm w-40 md:w-auto"
                />
              </div>
              <Button variant="outline" size="sm" className="bg-white border-gray-300 text-black h-9">
                <PlusCircle className="h-4 w-4 mr-2 text-gray-600" /> {t('add_person')}
              </Button>
              <Button variant="outline" size="sm" className="bg-white border-gray-300 text-black h-9">
                <Save className="h-4 w-4 mr-2 text-gray-600" /> {t('save')}
              </Button>
              <Button variant="outline" size="sm" className="bg-white border-gray-300 text-black h-9">
                <Upload className="h-4 w-4 mr-2 text-gray-600" /> {t('import')}
              </Button>
              <Button variant="outline" size="sm" className="bg-white border-gray-300 text-black h-9">
                <Download className="h-4 w-4 mr-2 text-gray-600" /> {t('export')}
              </Button>
              <Button variant="outline" size="sm" className="bg-white border-gray-300 text-black h-9">
                <Share2 className="h-4 w-4 mr-2 text-gray-600" /> {t('share')}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Info Panel - Shows quick help */}
        <motion.div 
          className="bg-gray-50 border-b border-gray-200 py-2 px-4 text-sm text-gray-600 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t('family_tree_instructions')}
        </motion.div>
        
        {/* Tree Visualization */}
        <div className="flex-grow p-0">
          <FamilyTree />
        </div>
      </main>
    </div>
  );
};

export default Tree;

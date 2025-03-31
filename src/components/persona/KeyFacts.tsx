
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface KeyFactsProps {
  personName: string;
  facts: string[];
}

const KeyFacts: React.FC<KeyFactsProps> = ({ personName, facts }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let intervalId: number;
    
    if (isAutoPlaying && facts.length > 1) {
      intervalId = window.setInterval(() => {
        setCurrentFactIndex(prevIndex => (prevIndex + 1) % facts.length);
      }, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoPlaying, facts.length]);

  const handlePrevFact = () => {
    setIsAutoPlaying(false);
    setCurrentFactIndex(prevIndex => (prevIndex - 1 + facts.length) % facts.length);
  };

  const handleNextFact = () => {
    setIsAutoPlaying(false);
    setCurrentFactIndex(prevIndex => (prevIndex + 1) % facts.length);
  };

  if (facts.length === 0) {
    return null;
  }

  return (
    <Card className="border border-gray-800 bg-black mb-6">
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <Lightbulb className="h-4 w-4 text-cyber-accent mr-2" />
          <h3 className="text-md font-medium">Key Fact about {personName}</h3>
        </div>
        
        <div className="relative h-20 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 z-10 h-7 w-7" 
            onClick={handlePrevFact}
            disabled={facts.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="w-full px-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFactIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center text-muted-foreground"
              >
                {facts[currentFactIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 z-10 h-7 w-7" 
            onClick={handleNextFact}
            disabled={facts.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-center mt-2 gap-1">
          {facts.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 w-1.5 rounded-full ${index === currentFactIndex ? 'bg-cyber-accent' : 'bg-gray-700'}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyFacts;

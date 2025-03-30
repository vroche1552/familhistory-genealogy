
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center py-16 lg:py-24 overflow-hidden" aria-labelledby="hero-heading">
      {/* Background pattern */}
      <div className="absolute inset-0 intelligence-pattern z-0 opacity-20"></div>
      
      {/* Overlay gradients */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-center lg:text-left max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Preserve Your Family's Legacy
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Document, connect, and visualize your ancestry with our intuitive family tree builder. Start your genealogy journey today.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link to="/dashboard">
                <Button size="lg" className="bg-white hover:bg-white/90 text-black font-medium shadow-lg hover:shadow-xl transition-all">
                  {t('get_started')} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="cyber-button">
                  {t('features')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hidden lg:block relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative cyber-border rounded-lg p-1 shadow-2xl">
              <div className="aspect-[4/3] rounded overflow-hidden cyber-card">
                {/* Family tree visualization */}
                <div className="w-full h-full bg-cyber-dark/30 p-6 grid grid-cols-3 gap-4 intelligence-pattern">
                  {[...Array(6)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="cyber-card p-3 flex flex-col items-center justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                    >
                      <div className="w-16 h-16 rounded-full bg-cyber-dark mb-2 overflow-hidden">
                        <img 
                          src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 1}.jpg`} 
                          alt="Family member portrait" 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-xs font-medium truncate w-full text-center">Person {i + 1}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true">
                <line x1="33%" y1="25%" x2="66%" y2="25%" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
                <line x1="33%" y1="50%" x2="66%" y2="50%" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
                <line x1="33%" y1="75%" x2="66%" y2="75%" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
                <line x1="50%" y1="25%" x2="50%" y2="50%" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="50%" y2="75%" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

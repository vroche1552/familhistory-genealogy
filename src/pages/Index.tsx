
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-cyber-dark/80"></div>
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-cyber-purple/5 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-cyber-accent/5 blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 cyber-text-gradient">Ready to Build Your Family Tree?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start documenting your family history today. Our platform makes it easy to create, connect, and preserve your family's legacy for generations to come.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="bg-cyber-accent hover:bg-cyber-accent/80 text-black font-medium">
                  Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-cyber-dark py-10 border-t border-cyber-border/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center text-lg font-bold cyber-text-gradient">
                  CyberFamily
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  © {new Date().getFullYear()} CyberFamily. All rights reserved.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <a href="#" className="text-cyber-foreground hover:text-cyber-accent transition-colors">Privacy Policy</a>
                <a href="#" className="text-cyber-foreground hover:text-cyber-accent transition-colors">Terms of Service</a>
                <a href="#" className="text-cyber-foreground hover:text-cyber-accent transition-colors">Contact</a>
                <a href="#" className="flex items-center text-cyber-foreground hover:text-cyber-accent transition-colors">
                  <Github className="h-4 w-4 mr-1" /> GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;


import { 
  Users, 
  Tree, 
  FileText, 
  Shield, 
  Search, 
  Share2 
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="cyber-card p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
      <div className="rounded-full bg-cyber-dark p-3 w-12 h-12 flex items-center justify-center mb-4 border border-cyber-accent/20">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-cyber-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-cyber-accent" />,
      title: "User Profiles",
      description: "Create secure accounts and personalized profiles to manage your family history in one place."
    },
    {
      icon: <Tree className="h-6 w-6 text-cyber-accent" />,
      title: "Interactive Tree Builder",
      description: "Build your family tree with our intuitive drag-and-drop interface with support for complex relationships."
    },
    {
      icon: <FileText className="h-6 w-6 text-cyber-accent" />,
      title: "Persona Pages",
      description: "Create detailed profiles for each ancestor including photos, documents and key life events."
    },
    {
      icon: <Shield className="h-6 w-6 text-cyber-accent" />,
      title: "Privacy Controls",
      description: "Advanced privacy settings to control who can see your family tree and personal information."
    },
    {
      icon: <Search className="h-6 w-6 text-cyber-accent" />,
      title: "Smart Search",
      description: "Powerful search tools to find ancestors by name, location, time period, or relationship."
    },
    {
      icon: <Share2 className="h-6 w-6 text-cyber-accent" />,
      title: "Export & Share",
      description: "Export your family tree in GEDCOM format or share it securely with family members."
    }
  ];

  return (
    <div className="py-20 bg-cyber-background cyber-grid">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 cyber-text-gradient">Key Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform offers a comprehensive set of tools to explore, document, and share your family history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

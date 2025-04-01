import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Twitter, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  const footerSections = [
    {
      title: t('footer.company.title'),
      links: [
        { label: t('footer.company.about'), href: '/about' },
        { label: t('footer.company.careers'), href: '/careers' },
        { label: t('footer.company.press'), href: '/press' }
      ]
    },
    {
      title: t('footer.resources.title'),
      links: [
        { label: t('footer.resources.documentation'), href: '/docs' },
        { label: t('footer.resources.help_center'), href: '/help' },
        { label: t('footer.resources.privacy'), href: '/privacy' },
        { label: t('footer.resources.terms'), href: '/terms' }
      ]
    },
    {
      title: t('footer.contact.title'),
      links: [
        { label: t('footer.contact.support'), href: '/support' },
        { label: t('footer.contact.sales'), href: '/sales' },
        { label: t('footer.contact.community'), href: '/community' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com/familhistory' },
    { icon: <Github className="h-5 w-5" />, href: 'https://github.com/familhistory' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/company/familhistory' }
  ];

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              {t('footer.social.title')}
            </h3>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
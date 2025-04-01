import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { useLanguage } from '@/contexts/LanguageContext';
import GedcomImport from '@/components/import/GedcomImport';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

const ImportPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground">
      <Container className="py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">{t('home')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/tree">{t('family_tree')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>{t('import_gedcom')}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 cyber-text-gradient">
            {t('import_gedcom')}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t('import_gedcom_description')}
          </p>
          <GedcomImport />
        </div>
      </Container>
    </div>
  );
};

export default ImportPage; 
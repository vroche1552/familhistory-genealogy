import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const EmailConfirmation: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <EnvelopeIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a confirmation link to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center font-medium mb-4">{email}</p>
          <p className="text-center text-muted-foreground">
            Click the link in the email to confirm your account. If you don't see the email, check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation; 
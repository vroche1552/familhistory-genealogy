
import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

export const CustomAvatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = '', 
  fallback, 
  className,
  ...props 
}) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div 
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {src && !hasError ? (
        <img 
          src={src} 
          alt={alt} 
          className="aspect-square h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          {fallback || <User className="h-6 w-6 text-muted-foreground" />}
        </div>
      )}
    </div>
  );
};

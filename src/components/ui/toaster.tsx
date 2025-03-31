
import { Toaster as Sonner } from "sonner";
import { cn } from "@/lib/utils";
import React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ className, ...props }: ToasterProps) {
  // Use a ref to store the toaster instance
  const toasterRef = React.useRef<any>(null);
  
  // Make toast function globally available
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__sonner = toasterRef.current;
    }
  }, []);

  return (
    <Sonner
      ref={toasterRef}
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };


import { useToast as useShadcnToast } from "@/components/ui/toast";

// Re-implement the toast functions to ensure they work properly
export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// We'll create a proper implementation that will work with the Sonner toast
export function useToast() {
  const { toast: innerToast } = useShadcnToast();
  
  return {
    toast: (props: ToastProps) => {
      innerToast({
        title: props.title,
        description: props.description,
        action: props.action,
        variant: props.variant || "default"
      });
    }
  };
}

export const toast = (props: ToastProps) => {
  // This creates a toast without needing the hook
  // We'll use the global toast function from Sonner
  const toastFn = (window as any).__sonner?.toast;
  
  if (toastFn) {
    toastFn({
      title: props.title,
      description: props.description,
      action: props.action
    });
  } else {
    console.log('Toast:', props);
  }
};

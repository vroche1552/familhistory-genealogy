
import * as React from "react";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function useToast() {
  const toast = (props: ToastProps) => {
    console.log('Toast:', props);
    // In a real implementation, this would show a toast
    // For now, we're just logging to make the app functional
  };

  return {
    toast,
    toasts: [],
    dismiss: () => {}
  };
}

export const toast = (props: ToastProps) => {
  console.log('Toast:', props);
  // Simplified toast function for direct usage
};

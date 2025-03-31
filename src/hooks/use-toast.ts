
import * as React from "react";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function useToast() {
  const toast = (props: ToastProps) => {
    console.log('Toast:', props);
    // Simplified implementation that just logs to console
  };

  return {
    toast
  };
}

export const toast = (props: ToastProps) => {
  console.log('Toast:', props);
  // Simplified direct toast function
};

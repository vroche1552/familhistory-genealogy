
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export function useToast() {
  return {
    toast: (props: ToastProps) => {
      sonnerToast(props.title as string, {
        description: props.description,
        action: props.action,
      });
    }
  };
}

export const toast = (props: ToastProps) => {
  sonnerToast(props.title as string, {
    description: props.description,
    action: props.action,
  });
};

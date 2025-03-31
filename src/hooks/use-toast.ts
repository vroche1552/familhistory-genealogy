
// Extremely simplified toast implementation
export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function useToast() {
  return {
    toast: (props: ToastProps) => {
      console.log('Toast:', props);
    }
  };
}

export const toast = (props: ToastProps) => {
  console.log('Toast:', props);
};

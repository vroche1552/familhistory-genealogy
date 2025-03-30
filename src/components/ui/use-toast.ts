
// Import the toast hooks from the correct location
import { useToast as useToastHook, toast } from "@/hooks/use-toast";

export const useToast = useToastHook;
export { toast };

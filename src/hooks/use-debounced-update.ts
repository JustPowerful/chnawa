import { useDocumentStore } from "@/stores/document.store";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

interface UpdateOptions {
  delay?: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useDebouncedUpdate<T, U>(
  updateFn: (data: T) => Promise<U>,
  options: UpdateOptions = {}
) {
  const { delay = 2000, onSuccess, onError } = options;
  const [isPending, startTransition] = useTransition();
  const setSaving = useDocumentStore((state) => state.setSaving);
  const debouncedUpdate = useDebouncedCallback(async (data: T) => {
    startTransition(async () => {
      try {
        setSaving(true);
        const result = await updateFn(data);
        onSuccess?.();
      } catch (error) {
        onError?.(error);
      } finally {
        setSaving(false);
      }
    });
  }, delay);

  return {
    isPending,
    debouncedUpdate,
  };
}

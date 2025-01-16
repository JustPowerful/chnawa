import { useQuery } from "@tanstack/react-query";
import { IDocument } from "@/models/Document";

export function useDocument(id: string) {
  return useQuery<IDocument>({
    queryKey: ["document", id],
    queryFn: async () => {
      const response = await fetch(`/api/document/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }
      const data = await response.json();
      if (!data.success || !data.document) {
        throw new Error(data.message || "Failed to fetch document");
      }
      return data.document;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

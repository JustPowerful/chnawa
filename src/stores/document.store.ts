import { create } from "zustand";

interface DocumentStore {
  documentId: string | null;
  saving: boolean;
  updateDocumentId: (documentId: string) => void;
  resetDocumetId: () => void;
  setSaving: (saving: boolean) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documentId: null,
  saving: false,
  updateDocumentId: (documentId: string) => set({ documentId }),
  resetDocumetId: () => set({ documentId: null }),
  setSaving: (saving: boolean) => set({ saving }),
}));

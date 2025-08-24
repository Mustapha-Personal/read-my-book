import AxiosClient from "@/services/AxiosClient";
import { Book } from "@/types/book";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type UseBooksParams = {
  is_favourite?: boolean;
  search?: string;
  limit?: number;
};

// ---- GET all books ----
export function useBooks(params?: UseBooksParams) {
  const { is_favourite, search, limit } = params || {};

  return useQuery<Book[]>({
    queryKey: ["books", { is_favourite, search, limit }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (is_favourite !== undefined) {
        queryParams.append("is_favourite", is_favourite.toString());
      }
      if (search) {
        queryParams.append("search", search);
      }
      if (limit) {
        queryParams.append("limit", limit.toString());
      }

      const res = await AxiosClient.get(`/books?${queryParams.toString()}`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ---- GET single book ----
export function useBook(id: number) {
  return useQuery<Book>({
    queryKey: ["books", id],
    queryFn: async () => {
      const res = await AxiosClient.get(`/books/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

// ---- ADD book ----
export function useAddBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: any) => {
      const formData = new FormData();

      // Get the correct MIME type based on file extension
      const mimeType =
        getMimeTypeFromFileName(file.name) ||
        file.type ||
        "application/octet-stream";

      console.log("mimeType", mimeType);

      formData.append("file", {
        uri: file.uri,
        name: file.name || "upload",
        type: mimeType,
      } as any);

      const res = await AxiosClient.post("/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

// Helper function to get MIME type from file extension
function getMimeTypeFromFileName(filename: string): string | null {
  const extension = filename.toLowerCase().split(".").pop();
  console.log("extension", extension);

  const mimeTypes: { [key: string]: string } = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };

  console.log('mimeTypes[extension || ""] ', mimeTypes[extension || ""]);
  return mimeTypes[extension || ""] || null;
}

// ---- DELETE book ----
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await AxiosClient.delete(`/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

// ---- TOGGLE favourite ----
export function useToggleFavourite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await AxiosClient.post(`/books/${id}/favourite`);
      return res.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["books", id] });
    },
  });
}

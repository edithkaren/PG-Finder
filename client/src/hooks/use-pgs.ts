import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type PgInput } from "@shared/routes";
import { z } from "zod";

// Helper to parse with logging
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

// GET /api/pgs
export function usePgs(filters?: { city?: string; gender?: string; search?: string }) {
  const queryKey = [api.pgs.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build query string manually or use URLSearchParams if strict types allowed
      const params = new URLSearchParams();
      if (filters?.city) params.append("city", filters.city);
      if (filters?.gender && filters.gender !== "all") params.append("gender", filters.gender);
      if (filters?.search) params.append("search", filters.search);

      const url = `${api.pgs.list.path}?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PGs");
      
      const data = await res.json();
      return parseWithLogging(api.pgs.list.responses[200], data, "pgs.list");
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useCities() {
  return useQuery({
    queryKey: [api.cities.list.path],
    queryFn: async () => {
      const res = await fetch(api.cities.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cities");
      const data = await res.json();
      return parseWithLogging(api.cities.list.responses[200], data, "cities.list");
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

// GET /api/pgs/:id
export function usePg(id: number) {
  return useQuery({
    queryKey: [api.pgs.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.pgs.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch PG details");
      
      const data = await res.json();
      return parseWithLogging(api.pgs.get.responses[200], data, "pgs.get");
    },
    enabled: !!id,
  });
}

// POST /api/pgs
export function useCreatePg() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PgInput) => {
      const res = await fetch(api.pgs.create.path, {
        method: api.pgs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          const parsedError = api.pgs.create.responses[400].parse(errorData);
          throw new Error(parsedError.message);
        }
        throw new Error("Failed to create listing");
      }
      
      const responseData = await res.json();
      return api.pgs.create.responses[201].parse(responseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.pgs.list.path] });
    },
  });
}

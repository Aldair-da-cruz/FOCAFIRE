"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import type { DetectionsQuery } from "./schemas";

export const useMeta = () => useQuery({ queryKey: ["meta"], queryFn: api.meta, staleTime: 5 * 60_000 });

export const useDetections = (q: DetectionsQuery) =>
  useQuery({ queryKey: ["detections", q], queryFn: () => api.detections(q), placeholderData: (prev) => prev });

export const useTimeseries = (year: number, sensor?: string) =>
  useQuery({ queryKey: ["timeseries", year, sensor], queryFn: () => api.timeseries(year, sensor), staleTime: 5 * 60_000 });

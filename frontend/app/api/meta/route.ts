import { NextResponse } from "next/server";
import { mockMeta } from "@/lib/api/mock";
export const GET = () => NextResponse.json(mockMeta);

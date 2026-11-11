import { NextResponse } from "next/server";

export const err = (status: number, code: string, error: string, details?: unknown) =>
  NextResponse.json({ error, code, details }, { status });

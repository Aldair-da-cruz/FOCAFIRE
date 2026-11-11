import { describe, expect, it } from "vitest";
import { DetectionsResponseSchema, MetaSchema } from "../schemas";
import { mockDetections, mockMeta } from "../mock";

describe("contrato", () => {
  it("meta mock cumpre o contrato", () => {
    expect(MetaSchema.safeParse(mockMeta).success).toBe(true);
  });
  it("detecções mock cumprem o contrato e respeitam limit/bbox", () => {
    const r = mockDetections({ bbox: [12, -18, 24, -4], limit: 50 });
    expect(DetectionsResponseSchema.safeParse(r).success).toBe(true);
    expect(r.data.length).toBeLessThanOrEqual(50);
    expect(r.data.every((d) => d.longitude >= 12 && d.longitude <= 24)).toBe(true);
  });
  it("frp null é diferente de 0", () => {
    const r = mockDetections({ bbox: [-180, -90, 180, 90], limit: 1000 });
    expect(r.data.some((d) => d.frp === null)).toBe(true);
  });
});

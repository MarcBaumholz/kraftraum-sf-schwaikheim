import { describe, expect, it } from "vitest";

import type { EquipmentItem } from "../types";
import { formatCurrency, nextVote, sortEquipment } from "./equipment";

const item = (
  id: string,
  score: number,
  createdAt: string
): EquipmentItem => ({
  id,
  title: id,
  description: "",
  externalUrl: null,
  imageUrl: "/test.webp",
  estimatedPriceCents: null,
  isSeeded: false,
  createdAt,
  upvotes: Math.max(score, 0),
  downvotes: Math.max(-score, 0),
  score,
  userVote: null
});

describe("sortEquipment", () => {
  it("sorts by score and then newest first", () => {
    const items = [
      item("older", 2, "2026-01-01T00:00:00Z"),
      item("popular", 5, "2026-01-01T00:00:00Z"),
      item("newer", 2, "2026-02-01T00:00:00Z")
    ];

    expect(sortEquipment(items).map(({ id }) => id)).toEqual([
      "popular",
      "newer",
      "older"
    ]);
    expect(items.map(({ id }) => id)).toEqual(["older", "popular", "newer"]);
  });
});

describe("nextVote", () => {
  it("sets, removes and switches a vote", () => {
    expect(nextVote(null, 1)).toBe(1);
    expect(nextVote(1, 1)).toBeNull();
    expect(nextVote(-1, 1)).toBe(1);
  });
});

describe("formatCurrency", () => {
  it("formats cents as German euros", () => {
    expect(formatCurrency(34900)).toMatch(/349/);
    expect(formatCurrency(34900)).toContain("€");
  });
});

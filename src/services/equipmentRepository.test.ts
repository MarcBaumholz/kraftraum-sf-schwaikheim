import { describe, expect, it } from "vitest";

import {
  createEquipmentRepository,
  mapEquipmentRow
} from "./equipmentRepository";

describe("createEquipmentRepository", () => {
  it("returns setup mode without public Supabase settings", async () => {
    const repository = createEquipmentRepository({ url: "", key: "" });

    expect(repository.mode).toBe("setup");
    await expect(repository.list()).resolves.toEqual([]);
    await expect(
      repository.vote("item", 1)
    ).rejects.toThrow(/Supabase/i);
  });
});

describe("mapEquipmentRow", () => {
  it("maps aggregate data into the app model", () => {
    expect(
      mapEquipmentRow({
        id: "abc",
        title: "Sandsack",
        description: null,
        external_url: "https://example.com",
        image_url: null,
        estimated_price_cents: 12000,
        is_seeded: false,
        created_at: "2026-06-11T08:00:00Z",
        upvotes: 4,
        downvotes: 1,
        score: 3,
        user_vote: -1
      })
    ).toMatchObject({
      id: "abc",
      title: "Sandsack",
      description: "",
      externalUrl: "https://example.com",
      estimatedPriceCents: 12000,
      upvotes: 4,
      downvotes: 1,
      score: 3,
      userVote: -1
    });
  });
});

import { describe, expect, it } from "vitest";

import {
  createEquipmentRepository,
  mapEquipmentRow
} from "./equipmentRepository";

describe("createEquipmentRepository", () => {
  it("returns a working local repository without public Supabase settings", async () => {
    localStorage.clear();
    const repository = createEquipmentRepository({ url: "", key: "" });

    expect(repository.mode).toBe("local");
    await expect(repository.list()).resolves.toEqual([
      expect.objectContaining({ title: "Rückenstrecker" }),
      expect.objectContaining({ title: "5-kg-Hanteln" }),
      expect.objectContaining({ title: "Digitale Wanduhr" })
    ]);
  });

  it("stores local suggestions and votes when Supabase is not configured", async () => {
    localStorage.clear();
    const repository = createEquipmentRepository({ url: "", key: "" });

    const created = await repository.submit({
      title: "Springseile",
      description: "Für Warm-up und Koordination.",
      externalUrl: "https://example.com/springseile",
      image: null
    });
    await repository.vote(created.id, 1);

    await expect(repository.list()).resolves.toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: "Springseile",
        upvotes: 1,
        score: 1,
        userVote: 1
      })
    ]));
  });

  it("stores local votes for seeded equipment", async () => {
    localStorage.clear();
    const repository = createEquipmentRepository({ url: "", key: "" });

    await repository.vote("11111111-1111-4111-8111-111111111111", 1);

    await expect(repository.list()).resolves.toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "11111111-1111-4111-8111-111111111111",
        upvotes: 1,
        score: 1,
        userVote: 1
      })
    ]));
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

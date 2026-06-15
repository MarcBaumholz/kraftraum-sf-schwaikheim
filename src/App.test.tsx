import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { EquipmentRepository } from "./services/equipmentRepository";
import type { EquipmentItem } from "./types";
import App from "./App";

const liveItem: EquipmentItem = {
  id: "live-item",
  title: "Sandsack",
  description: "Für Athletik und Ausdauer.",
  externalUrl: null,
  imageUrl: "/assets/image-fallback.webp",
  estimatedPriceCents: 13900,
  isSeeded: false,
  createdAt: "2026-06-11T08:00:00Z",
  upvotes: 3,
  downvotes: 1,
  score: 2,
  userVote: null
};

describe("App", () => {
  it("shows the static equipment and local voting guidance without Supabase", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /gemeinsam machen wir unseren kraftraum stärker/i
      })
    ).toBeVisible();
    expect(screen.getByText("Rückenstrecker")).toBeVisible();
    expect(
      screen.getByText(/funktionieren auf diesem gerät/i)
    ).toBeVisible();
    expect(
      screen.getByText(/supabase aktiviert werden/i)
    ).toBeVisible();
  });

  it("loads shared items and applies an optimistic upvote", async () => {
    const user = userEvent.setup();
    const repository: EquipmentRepository = {
      mode: "live",
      list: vi.fn().mockResolvedValue([liveItem]),
      submit: vi.fn(),
      vote: vi.fn().mockResolvedValue(1)
    };

    render(<App repository={repository} />);

    expect(await screen.findByText("Sandsack")).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: /sandsack hochstimmen/i })
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /sandsack hochstimmen, aktuell 4/i })
      ).toHaveAttribute("aria-pressed", "true")
    );
    expect(repository.vote).toHaveBeenCalledWith("live-item", 1);
  });
});

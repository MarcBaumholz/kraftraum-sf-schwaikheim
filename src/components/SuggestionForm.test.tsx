import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SuggestionForm } from "./SuggestionForm";

describe("SuggestionForm", () => {
  it("shows inline validation errors for incomplete input", async () => {
    const user = userEvent.setup();
    render(
      <SuggestionForm disabled={false} isSubmitting={false} onSubmit={vi.fn()} />
    );

    await user.click(
      screen.getByRole("button", { name: /vorschlag veröffentlichen/i })
    );

    expect(
      screen.getByText("Bitte gib deinem Vorschlag einen Titel.")
    ).toBeVisible();
    expect(screen.getByText(/link oder ein bild/i)).toBeVisible();
  });

  it("submits a valid link suggestion", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <SuggestionForm
        disabled={false}
        isSubmitting={false}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/^titel/i), "Neue Klimmzugstange");
    await user.type(
      screen.getByLabelText(/^link/i),
      "https://example.com/klimmzugstange"
    );
    await user.click(
      screen.getByRole("button", { name: /vorschlag veröffentlichen/i })
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Neue Klimmzugstange",
        externalUrl: "https://example.com/klimmzugstange"
      })
    );
  });
});

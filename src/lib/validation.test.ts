import { describe, expect, it } from "vitest";

import { validateSuggestion } from "./validation";

const validInput = {
  title: "Neue Gewichtsscheiben",
  description: "Mehr Auswahl für Kniebeugen.",
  externalUrl: "https://example.com/scheiben",
  image: null
};

describe("validateSuggestion", () => {
  it("accepts a valid link suggestion", () => {
    expect(validateSuggestion(validInput)).toEqual({});
  });

  it("requires a title and either link or image", () => {
    expect(
      validateSuggestion({
        title: " ",
        description: "",
        externalUrl: "",
        image: null
      })
    ).toMatchObject({
      title: expect.any(String),
      form: expect.any(String)
    });
  });

  it("rejects unsupported URLs", () => {
    expect(
      validateSuggestion({ ...validInput, externalUrl: "javascript:alert(1)" })
    ).toHaveProperty("externalUrl");
  });

  it("rejects oversized and unsupported images", () => {
    const file = new File(["x"], "plan.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 6 * 1024 * 1024 });

    expect(
      validateSuggestion({ ...validInput, externalUrl: "", image: file })
    ).toHaveProperty("image");
  });

  it("enforces title and description limits", () => {
    expect(
      validateSuggestion({
        ...validInput,
        title: "x".repeat(81),
        description: "x".repeat(501)
      })
    ).toMatchObject({
      title: expect.any(String),
      description: expect.any(String)
    });
  });
});

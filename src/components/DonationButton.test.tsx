import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DonationButton } from "./DonationButton";

describe("DonationButton", () => {
  it("renders a safe external link when configured", () => {
    render(
      <DonationButton href="https://www.paypal.com/pool/9q56Tvt6Af?sr=wccr" />
    );

    const link = screen.getByRole("link", {
      name: /zum paypal-pool/i
    });

    expect(link).toMatchObject({
      target: "_blank",
      rel: expect.stringContaining("noopener")
    });
    expect(link).toHaveAttribute(
      "href",
      "https://www.paypal.com/pool/9q56Tvt6Af?sr=wccr"
    );
  });
});

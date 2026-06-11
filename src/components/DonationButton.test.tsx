import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DonationButton } from "./DonationButton";

describe("DonationButton", () => {
  it("explains the placeholder when no PayPal URL exists", async () => {
    const user = userEvent.setup();
    render(<DonationButton href="" />);

    await user.click(
      screen.getByRole("button", { name: /kraftraum unterstützen/i })
    );

    expect(screen.getByRole("status")).toHaveTextContent(/folgt/i);
  });

  it("renders a safe external link when configured", () => {
    render(<DonationButton href="https://paypal.me/example" />);

    expect(
      screen.getByRole("link", { name: /kraftraum unterstützen/i })
    ).toMatchObject({
      target: "_blank",
      rel: expect.stringContaining("noopener")
    });
  });
});

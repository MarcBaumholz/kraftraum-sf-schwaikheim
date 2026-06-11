import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { VoteControl } from "./VoteControl";

describe("VoteControl", () => {
  it("exposes the active vote and emits vote intents", async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();

    render(
      <VoteControl
        title="Rückenstrecker"
        upvotes={7}
        downvotes={2}
        userVote={1}
        disabled={false}
        onVote={onVote}
      />
    );

    expect(screen.getByRole("button", { name: /rückenstrecker hochstimmen/i }))
      .toHaveAttribute("aria-pressed", "true");

    await user.click(
      screen.getByRole("button", { name: /rückenstrecker runterstimmen/i })
    );
    expect(onVote).toHaveBeenCalledWith(-1);
  });
});

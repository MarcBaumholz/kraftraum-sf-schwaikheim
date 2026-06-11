import { ThumbsDown, ThumbsUp } from "lucide-react";

import type { VoteValue } from "../types";

interface VoteControlProps {
  title: string;
  upvotes: number;
  downvotes: number;
  userVote: VoteValue | null;
  disabled: boolean;
  onVote: (value: VoteValue) => void;
}

export function VoteControl({
  title,
  upvotes,
  downvotes,
  userVote,
  disabled,
  onVote
}: VoteControlProps) {
  return (
    <div className="vote-control" aria-label={`Abstimmung für ${title}`}>
      <button
        type="button"
        className="vote-control__button vote-control__button--up"
        aria-label={`${title} hochstimmen, aktuell ${upvotes}`}
        aria-pressed={userVote === 1}
        disabled={disabled}
        onClick={() => onVote(1)}
      >
        <ThumbsUp aria-hidden="true" />
        <span>{upvotes}</span>
      </button>
      <span className="vote-control__score" aria-label="Stimmensaldo">
        {upvotes - downvotes > 0 ? "+" : ""}
        {upvotes - downvotes}
      </span>
      <button
        type="button"
        className="vote-control__button vote-control__button--down"
        aria-label={`${title} runterstimmen, aktuell ${downvotes}`}
        aria-pressed={userVote === -1}
        disabled={disabled}
        onClick={() => onVote(-1)}
      >
        <ThumbsDown aria-hidden="true" />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}

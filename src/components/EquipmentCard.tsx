import { ExternalLink } from "lucide-react";

import { fallbackImage } from "../config/site";
import { formatCurrency } from "../lib/equipment";
import type { EquipmentItem, VoteValue } from "../types";
import { VoteControl } from "./VoteControl";

interface EquipmentCardProps {
  item: EquipmentItem;
  votingDisabled: boolean;
  isVoting: boolean;
  onVote: (item: EquipmentItem, value: VoteValue) => void;
}

export function EquipmentCard({
  item,
  votingDisabled,
  isVoting,
  onVote
}: EquipmentCardProps) {
  return (
    <article className={`equipment-card ${item.isSeeded ? "equipment-card--seeded" : ""}`}>
      <div className="equipment-card__image">
        <img
          src={item.imageUrl || fallbackImage}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
        {item.isSeeded && <span className="tag">Startauswahl</span>}
      </div>
      <div className="equipment-card__body">
        <div className="equipment-card__heading">
          <div>
            <h3>{item.title}</h3>
            {item.estimatedPriceCents !== null && (
              <p className="price">
                ca. {formatCurrency(item.estimatedPriceCents)}
              </p>
            )}
          </div>
          {!item.isSeeded && (
            <time dateTime={item.createdAt}>
              {new Intl.DateTimeFormat("de-DE", {
                day: "2-digit",
                month: "short"
              }).format(new Date(item.createdAt))}
            </time>
          )}
        </div>
        {item.description && <p>{item.description}</p>}
        {item.externalUrl && (
          <a
            className="external-link"
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Gerät ansehen
            <ExternalLink aria-hidden="true" />
          </a>
        )}
        <VoteControl
          title={item.title}
          upvotes={item.upvotes}
          downvotes={item.downvotes}
          userVote={item.userVote}
          disabled={votingDisabled || isVoting}
          onVote={(value) => onVote(item, value)}
        />
      </div>
    </article>
  );
}

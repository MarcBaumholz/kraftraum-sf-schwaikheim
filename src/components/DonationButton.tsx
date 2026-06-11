import { useState } from "react";
import { ArrowUpRight, Heart } from "lucide-react";

interface DonationButtonProps {
  href: string;
  compact?: boolean;
}

export function DonationButton({
  href,
  compact = false
}: DonationButtonProps) {
  const [showMessage, setShowMessage] = useState(false);
  const className = compact
    ? "button button--primary button--compact"
    : "button button--primary";

  if (href) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Heart aria-hidden="true" />
        Kraftraum unterstützen
        <ArrowUpRight aria-hidden="true" />
      </a>
    );
  }

  return (
    <span className="donation-action">
      <button
        className={className}
        type="button"
        onClick={() => setShowMessage(true)}
      >
        <Heart aria-hidden="true" />
        Kraftraum unterstützen
      </button>
      {showMessage && (
        <span className="donation-action__message" role="status">
          Der PayPal-Spendenlink folgt in Kürze.
        </span>
      )}
    </span>
  );
}

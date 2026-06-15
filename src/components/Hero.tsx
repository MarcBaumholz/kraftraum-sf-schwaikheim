import { ArrowDown, CheckCircle2 } from "lucide-react";

import { heroImage, siteConfig } from "../config/site";
import { formatCurrency } from "../lib/equipment";
import { DonationButton } from "./DonationButton";

export function Hero() {
  const progress = Math.min(
    100,
    Math.round((siteConfig.raisedCents / siteConfig.goalCents) * 100)
  );

  return (
    <section className="hero" id="top">
      <div className="hero__content">
        <p className="eyebrow">Von der Mannschaft. Für die Mannschaft.</p>
        <h1>
          Gemeinsam machen wir unseren <em>Kraftraum stärker.</em>
        </h1>
        <p className="hero__lead">
          Das Squat Rack steht. Jetzt sammeln wir im PayPal-Pool weiter und
          entscheiden gemeinsam, welche Ausstattung als Nächstes dazukommt.
        </p>
        <div className="hero__actions">
          <DonationButton href={siteConfig.paypalUrl} />
          <a className="button button--ghost" href="#geraete">
            Geräte ansehen
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
        <div className="progress-card" aria-label={`Spendenfortschritt ${progress} Prozent`}>
          <div className="progress-card__header">
            <span>PayPal-Pool</span>
            <strong>
              {formatCurrency(siteConfig.raisedCents)} /{" "}
              {formatCurrency(siteConfig.goalCents)}
            </strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>
            <CheckCircle2 aria-hidden="true" />
            Zielbetrag aus dem aktuellen PayPal-Pool.
          </p>
        </div>
      </div>
      <div className="hero__visual">
        <img
          src={heroImage}
          alt="Illustrierter Kraftraum mit Hantelbereich"
        />
        <span className="hero__stamp">Nächstes Level</span>
      </div>
    </section>
  );
}

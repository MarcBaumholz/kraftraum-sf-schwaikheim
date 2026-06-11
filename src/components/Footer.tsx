import { siteConfig } from "../config/site";
import { DonationButton } from "./DonationButton";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p className="eyebrow">Jeder Beitrag zählt</p>
        <h2>Ein besserer Kraftraum beginnt mit uns.</h2>
      </div>
      <DonationButton href={siteConfig.paypalUrl} />
      <div className="site-footer__meta">
        <span>Von den aktiven Mannschaften der {siteConfig.clubName}</span>
        <span>Projektstand: {siteConfig.lastUpdated}</span>
        <span>Impressum & Datenschutz werden ergänzt.</span>
      </div>
    </footer>
  );
}

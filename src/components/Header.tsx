import { Dumbbell } from "lucide-react";

import { siteConfig } from "../config/site";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Zum Seitenanfang">
        <span className="brand__mark">
          <Dumbbell aria-hidden="true" />
        </span>
        <span>
          <strong>{siteConfig.clubName}</strong>
          <small>{siteConfig.projectName}</small>
        </span>
      </a>
      <a className="text-link" href="#ideen">
        Idee einreichen
      </a>
    </header>
  );
}

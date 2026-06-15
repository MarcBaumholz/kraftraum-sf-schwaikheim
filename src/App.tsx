import { useEffect, useState } from "react";
import { Check, CircleAlert, Plus, Trophy } from "lucide-react";

import { EquipmentCard } from "./components/EquipmentCard";
import { DonationButton } from "./components/DonationButton";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SuggestionForm } from "./components/SuggestionForm";
import {
  quadRackImage,
  seedEquipment,
  siteConfig
} from "./config/site";
import { nextVote, sortEquipment } from "./lib/equipment";
import {
  createEquipmentRepository,
  type EquipmentRepository
} from "./services/equipmentRepository";
import type {
  EquipmentItem,
  SuggestionInput,
  VoteValue
} from "./types";

const defaultRepository = createEquipmentRepository({
  url: import.meta.env.VITE_SUPABASE_URL ?? "",
  key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""
});

interface AppProps {
  repository?: EquipmentRepository;
}

function withLocalSeedAssets(items: EquipmentItem[]): EquipmentItem[] {
  const localById = new Map(seedEquipment.map((item) => [item.id, item]));

  return items.map((item) => {
    const local = localById.get(item.id);
    return local
      ? {
          ...item,
          imageUrl: item.imageUrl || local.imageUrl,
          description: item.description || local.description,
          estimatedPriceCents:
            item.estimatedPriceCents ?? local.estimatedPriceCents,
          isSeeded: true
        }
      : item;
  });
}

function applyVote(
  item: EquipmentItem,
  requested: VoteValue
): EquipmentItem {
  const target = nextVote(item.userVote, requested);
  let upvotes = item.upvotes;
  let downvotes = item.downvotes;

  if (item.userVote === 1) upvotes -= 1;
  if (item.userVote === -1) downvotes -= 1;
  if (target === 1) upvotes += 1;
  if (target === -1) downvotes += 1;

  return {
    ...item,
    upvotes,
    downvotes,
    score: upvotes - downvotes,
    userVote: target
  };
}

export default function App({ repository = defaultRepository }: AppProps) {
  const [items, setItems] = useState<EquipmentItem[]>(seedEquipment);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingIds, setVotingIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;
    repository
      .list()
      .then((loaded) => {
        if (active) {
          setItems(sortEquipment(withLocalSeedAssets(loaded)));
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setError(
            "Die gemeinsamen Vorschläge konnten gerade nicht geladen werden. Die Startauswahl bleibt sichtbar."
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [repository]);

  const handleVote = async (
    item: EquipmentItem,
    requested: VoteValue
  ) => {
    const previous = item;
    const optimistic = applyVote(item, requested);
    setVotingIds((current) => new Set(current).add(item.id));
    setItems((current) =>
      sortEquipment(
        current.map((candidate) =>
          candidate.id === item.id ? optimistic : candidate
        )
      )
    );
    setError("");

    try {
      await repository.vote(item.id, requested);
    } catch {
      setItems((current) =>
        sortEquipment(
          current.map((candidate) =>
            candidate.id === item.id ? previous : candidate
          )
        )
      );
      setError("Deine Stimme konnte nicht gespeichert werden. Versuch es erneut.");
    } finally {
      setVotingIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleSubmit = async (input: SuggestionInput) => {
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const created = await repository.submit(input);
      setItems((current) => sortEquipment([created, ...current]));
      setMessage("Dein Vorschlag ist jetzt für alle sichtbar.");
    } catch {
      setError(
        "Der Vorschlag konnte nicht veröffentlicht werden. Bitte prüfe deine Verbindung und versuche es erneut."
      );
      throw new Error("submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const seeded = items.filter((item) => item.isSeeded);
  const community = items.filter((item) => !item.isSeeded);
  const isLocal = repository.mode === "local";

  return (
    <>
      <div className="page-shell">
        <Header />
        <main>
          <Hero />

          <section className="milestone section">
            <div className="milestone__image">
              <img src={quadRackImage} alt="Illustriertes Quad Rack" />
              <span>
                <Check aria-hidden="true" />
                Geschafft
              </span>
            </div>
            <div className="milestone__content">
              <p className="eyebrow">Unser erster gemeinsamer Erfolg</p>
              <h2>Das Quad Rack steht bereits.</h2>
              <p>
                Die letzte Sammelaktion hat gezeigt, was wir zusammen bewegen
                können. Jetzt gehen wir den nächsten Schritt.
              </p>
              <div className="milestone__number">
                <Trophy aria-hidden="true" />
                <span>
                  <strong>1</strong>
                  großes Gerät gemeinsam finanziert
                </span>
              </div>
            </div>
          </section>

          <section className="section equipment-section" id="geraete">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Was kommt als Nächstes?</p>
                <h2>Unsere Startauswahl</h2>
              </div>
              <p>
                Stimme für die Geräte, die unserem Training am meisten bringen.
                Die Beträge orientieren sich am aktuellen PayPal-Pool und
                helfen bei der Priorisierung.
              </p>
            </div>

            {isLocal && (
              <div className="setup-banner" role="status">
                <CircleAlert aria-hidden="true" />
                <div>
                  <strong>Stimmen und Vorschläge funktionieren sofort.</strong>
                  <p>
                    Ohne Supabase werden sie auf diesem Gerät gespeichert.
                    Für gemeinsame Live-Ergebnisse können später die
                    Supabase-Zugangsdaten ergänzt werden.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <p className="form-message form-message--error" role="alert">
                {error}
              </p>
            )}

            <div className="equipment-grid" aria-busy={isLoading}>
              {seeded.map((item) => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  votingDisabled={false}
                  isVoting={votingIds.has(item.id)}
                  onVote={handleVote}
                />
              ))}
            </div>
          </section>

          <section className="ideas section" id="ideen">
            <div className="ideas__intro">
              <p className="eyebrow">Deine Idee zählt</p>
              <h2>Was fehlt dir noch?</h2>
              <p>
                Poste einen Link oder ein Bild. Der Vorschlag erscheint direkt
                und kann von allen bewertet werden.
              </p>
              <div className="ideas__steps" aria-label="So funktioniert es">
                <span><b>01</b> Idee einreichen</span>
                <span><b>02</b> Gemeinsam abstimmen</span>
                <span><b>03</b> Favoriten finanzieren</span>
              </div>
            </div>
            <div className="ideas__form-card">
              <div className="form-card__heading">
                <span><Plus aria-hidden="true" /></span>
                <div>
                  <h3>Neuen Vorschlag posten</h3>
                  <p>Keine Anmeldung und kein sichtbares Profil.</p>
                </div>
              </div>
              <SuggestionForm
                disabled={false}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />
              {message && (
                <p className="form-message form-message--success" role="status">
                  {message}
                </p>
              )}
            </div>
          </section>

          <section className="section community-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Aus der Mannschaft</p>
                <h2>Vorschläge aus der Mannschaft</h2>
              </div>
              <p>Sortiert nach Stimmensaldo. Bei Gleichstand zählt die neuere Idee.</p>
            </div>
            {community.length > 0 ? (
              <div className="equipment-grid">
                {community.map((item) => (
                  <EquipmentCard
                    key={item.id}
                    item={item}
                    votingDisabled={false}
                    isVoting={votingIds.has(item.id)}
                    onVote={handleVote}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Plus aria-hidden="true" />
                <h3>Der erste Vorschlag kann deiner sein.</h3>
                <p>Teile, was unser Training noch besser machen würde.</p>
                <a className="button button--dark" href="#ideen">
                  Idee einreichen
                </a>
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
      <div className="mobile-donate">
        <span>
          <strong>{siteConfig.projectName}</strong>
          Gemeinsam stärker
        </span>
        <DonationButton href={siteConfig.paypalUrl} compact />
      </div>
    </>
  );
}

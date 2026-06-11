import type { EquipmentItem } from "../types";

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

export const siteConfig = {
  clubName: "SF Schwaikheim Handball",
  projectName: "Projekt Kraftraum",
  paypalUrl: "",
  goalCents: 120000,
  raisedCents: 65000,
  lastUpdated: "Juni 2026"
};

export const seedEquipment: EquipmentItem[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Rückenstrecker",
    description:
      "Für gezieltes Training der unteren Rücken- und Rumpfmuskulatur.",
    externalUrl: null,
    imageUrl: asset("rueckenstrecker.webp"),
    estimatedPriceCents: 34900,
    isSeeded: true,
    createdAt: "2026-06-01T08:00:00Z",
    upvotes: 0,
    downvotes: 0,
    score: 0,
    userVote: null
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "5-kg-Hanteln",
    description:
      "Leichtere Gewichte für Reha, Schultertraining und Warm-up.",
    externalUrl: null,
    imageUrl: asset("hanteln-5kg.webp"),
    estimatedPriceCents: 4900,
    isSeeded: true,
    createdAt: "2026-06-02T08:00:00Z",
    upvotes: 0,
    downvotes: 0,
    score: 0,
    userVote: null
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "Digitale Wanduhr",
    description:
      "Große Trainingszeit für Intervalle, Pausen und Zirkel.",
    externalUrl: null,
    imageUrl: asset("wanduhr.webp"),
    estimatedPriceCents: 8900,
    isSeeded: true,
    createdAt: "2026-06-03T08:00:00Z",
    upvotes: 0,
    downvotes: 0,
    score: 0,
    userVote: null
  }
];

export const quadRackImage = asset("quad-rack.webp");
export const heroImage = asset("kraftraum-hero.webp");
export const fallbackImage = asset("image-fallback.webp");

export type VoteValue = -1 | 1;

export interface EquipmentItem {
  id: string;
  title: string;
  description: string;
  externalUrl: string | null;
  imageUrl: string;
  estimatedPriceCents: number | null;
  isSeeded: boolean;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: VoteValue | null;
}

export interface SuggestionInput {
  title: string;
  description: string;
  externalUrl: string;
  image: File | null;
}

export type SuggestionErrors = Partial<
  Record<keyof SuggestionInput | "form", string>
>;

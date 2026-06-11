import type { EquipmentItem, VoteValue } from "../types";

export function sortEquipment(items: EquipmentItem[]): EquipmentItem[] {
  return [...items].sort((left, right) => {
    if (left.score !== right.score) {
      return right.score - left.score;
    }

    return Date.parse(right.createdAt) - Date.parse(left.createdAt);
  });
}

export function nextVote(
  current: VoteValue | null,
  requested: VoteValue
): VoteValue | null {
  return current === requested ? null : requested;
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(cents / 100);
}

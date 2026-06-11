import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createOptionalSupabaseClient, type SupabaseSettings } from "../lib/supabase";
import type {
  EquipmentItem,
  SuggestionInput,
  VoteValue
} from "../types";

interface EquipmentRow {
  id: string;
  title: string;
  description: string | null;
  external_url: string | null;
  image_url: string | null;
  estimated_price_cents: number | null;
  is_seeded: boolean;
  created_at: string;
  upvotes: number;
  downvotes: number;
  score: number;
  user_vote: number | null;
}

export interface EquipmentRepository {
  mode: "setup" | "live";
  list(): Promise<EquipmentItem[]>;
  submit(input: SuggestionInput): Promise<EquipmentItem>;
  vote(itemId: string, value: VoteValue): Promise<VoteValue | null>;
}

const setupError =
  "Supabase ist noch nicht eingerichtet. Ergänze die öffentlichen Konfigurationswerte, um Vorschläge und Votes zu aktivieren.";

export function mapEquipmentRow(row: EquipmentRow): EquipmentItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    externalUrl: row.external_url,
    imageUrl: row.image_url ?? "",
    estimatedPriceCents: row.estimated_price_cents,
    isSeeded: row.is_seeded,
    createdAt: row.created_at,
    upvotes: Number(row.upvotes ?? 0),
    downvotes: Number(row.downvotes ?? 0),
    score: Number(row.score ?? 0),
    userVote: row.user_vote === 1 || row.user_vote === -1 ? row.user_vote : null
  };
}

async function ensureAnonymousUser(client: SupabaseClient): Promise<User> {
  const {
    data: { user }
  } = await client.auth.getUser();

  if (user) {
    return user;
  }

  const { data, error } = await client.auth.signInAnonymously();

  if (error || !data.user) {
    throw new Error(
      error?.message ??
        "Die anonyme Sitzung konnte nicht eingerichtet werden."
    );
  }

  return data.user;
}

function setupRepository(): EquipmentRepository {
  return {
    mode: "setup",
    async list() {
      return [];
    },
    async submit() {
      throw new Error(setupError);
    },
    async vote() {
      throw new Error(setupError);
    }
  };
}

function liveRepository(client: SupabaseClient): EquipmentRepository {
  const list = async (): Promise<EquipmentItem[]> => {
    await ensureAnonymousUser(client);
    const { data, error } = await client.rpc("list_equipment");

    if (error) {
      throw new Error(error.message);
    }

    return ((data ?? []) as EquipmentRow[]).map(mapEquipmentRow);
  };

  return {
    mode: "live",
    list,
    async submit(input) {
      const user = await ensureAnonymousUser(client);
      let imageUrl: string | null = null;

      if (input.image) {
        const extension = input.image.name.split(".").pop()?.toLowerCase() ?? "webp";
        const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await client.storage
          .from("suggestion-images")
          .upload(path, input.image, {
            cacheControl: "3600",
            contentType: input.image.type,
            upsert: false
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        imageUrl = client.storage
          .from("suggestion-images")
          .getPublicUrl(path).data.publicUrl;
      }

      const { data, error } = await client
        .from("equipment_items")
        .insert({
          title: input.title.trim(),
          description: input.description.trim() || null,
          external_url: input.externalUrl.trim() || null,
          image_url: imageUrl,
          created_by: user.id,
          is_seeded: false
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const created = (await list()).find((item) => item.id === data.id);

      if (!created) {
        throw new Error("Der neue Vorschlag konnte nicht geladen werden.");
      }

      return created;
    },
    async vote(itemId, value) {
      await ensureAnonymousUser(client);
      const { data, error } = await client.rpc("set_equipment_vote", {
        p_item_id: itemId,
        p_value: value
      });

      if (error) {
        throw new Error(error.message);
      }

      return data === 1 || data === -1 ? data : null;
    }
  };
}

export function createEquipmentRepository(
  settings: SupabaseSettings
): EquipmentRepository {
  const client = createOptionalSupabaseClient(settings);
  return client ? liveRepository(client) : setupRepository();
}

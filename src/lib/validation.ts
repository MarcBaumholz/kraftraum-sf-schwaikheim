import type { SuggestionErrors, SuggestionInput } from "../types";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageBytes = 5 * 1024 * 1024;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateSuggestion(
  input: SuggestionInput
): SuggestionErrors {
  const errors: SuggestionErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();
  const externalUrl = input.externalUrl.trim();

  if (!title) {
    errors.title = "Bitte gib deinem Vorschlag einen Titel.";
  } else if (title.length > 80) {
    errors.title = "Der Titel darf höchstens 80 Zeichen lang sein.";
  }

  if (description.length > 500) {
    errors.description =
      "Die Begründung darf höchstens 500 Zeichen lang sein.";
  }

  if (externalUrl && !isHttpUrl(externalUrl)) {
    errors.externalUrl =
      "Bitte verwende einen vollständigen Link mit http:// oder https://.";
  }

  if (input.image) {
    if (!allowedImageTypes.has(input.image.type)) {
      errors.image = "Erlaubt sind JPEG-, PNG- oder WebP-Bilder.";
    } else if (input.image.size > maxImageBytes) {
      errors.image = "Das Bild darf höchstens 5 MB groß sein.";
    }
  }

  if (!externalUrl && !input.image) {
    errors.form = "Füge mindestens einen Link oder ein Bild hinzu.";
  }

  return errors;
}

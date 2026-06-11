import { useState, type FormEvent } from "react";
import { ImagePlus, Link2, Send } from "lucide-react";

import { validateSuggestion } from "../lib/validation";
import type {
  SuggestionErrors,
  SuggestionInput
} from "../types";

interface SuggestionFormProps {
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: (input: SuggestionInput) => Promise<void>;
}

const emptyForm: SuggestionInput = {
  title: "",
  description: "",
  externalUrl: "",
  image: null
};

export function SuggestionForm({
  disabled,
  isSubmitting,
  onSubmit
}: SuggestionFormProps) {
  const [values, setValues] = useState<SuggestionInput>(emptyForm);
  const [errors, setErrors] = useState<SuggestionErrors>({});

  const update = (field: keyof SuggestionInput, value: string | File | null) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validateSuggestion(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await onSubmit(values);
      setValues(emptyForm);
      form.reset();
    } catch {
      // The parent renders the actionable server error and keeps the input.
    }
  };

  return (
    <form className="suggestion-form" noValidate onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="suggestion-title">Titel</label>
        <span className="field__hint">Was fehlt im Kraftraum?</span>
        <input
          id="suggestion-title"
          name="title"
          maxLength={80}
          value={values.title}
          disabled={disabled || isSubmitting}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "suggestion-title-error" : undefined}
          onChange={(event) => update("title", event.target.value)}
        />
        <span className="field__count">{values.title.length}/80</span>
        {errors.title && (
          <span className="field__error" id="suggestion-title-error">
            {errors.title}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="suggestion-description">Begründung</label>
        <span className="field__hint">
          Optional: Warum wäre das eine gute Ergänzung?
        </span>
        <textarea
          id="suggestion-description"
          name="description"
          maxLength={500}
          rows={4}
          value={values.description}
          disabled={disabled || isSubmitting}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "suggestion-description-error" : undefined
          }
          onChange={(event) => update("description", event.target.value)}
        />
        <span className="field__count">{values.description.length}/500</span>
        {errors.description && (
          <span className="field__error" id="suggestion-description-error">
            {errors.description}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="suggestion-link">
          <Link2 aria-hidden="true" />
          Link
        </label>
        <span className="field__hint">
          Optional: Link zu einem konkreten Gerät.
        </span>
        <input
          id="suggestion-link"
          name="externalUrl"
          type="url"
          inputMode="url"
          placeholder="https://..."
          value={values.externalUrl}
          disabled={disabled || isSubmitting}
          aria-invalid={Boolean(errors.externalUrl)}
          aria-describedby={
            errors.externalUrl ? "suggestion-link-error" : undefined
          }
          onChange={(event) => update("externalUrl", event.target.value)}
        />
        {errors.externalUrl && (
          <span className="field__error" id="suggestion-link-error">
            {errors.externalUrl}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="suggestion-image">
          <ImagePlus aria-hidden="true" />
          Bild
        </label>
        <span className="field__hint">
          Optional: JPEG, PNG oder WebP bis 5 MB.
        </span>
        <input
          id="suggestion-image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled || isSubmitting}
          aria-invalid={Boolean(errors.image)}
          aria-describedby={
            errors.image ? "suggestion-image-error" : undefined
          }
          onChange={(event) => update("image", event.target.files?.[0] ?? null)}
        />
        {errors.image && (
          <span className="field__error" id="suggestion-image-error">
            {errors.image}
          </span>
        )}
      </div>

      {errors.form && (
        <p className="form-message form-message--error" role="alert">
          {errors.form}
        </p>
      )}

      <p className="suggestion-form__privacy">
        Dein Vorschlag wird direkt öffentlich sichtbar. Bitte lade nur Bilder
        hoch, die du teilen darfst.
      </p>

      <button
        className="button button--dark"
        type="submit"
        disabled={disabled || isSubmitting}
      >
        <Send aria-hidden="true" />
        {isSubmitting ? "Wird veröffentlicht …" : "Vorschlag veröffentlichen"}
      </button>
    </form>
  );
}

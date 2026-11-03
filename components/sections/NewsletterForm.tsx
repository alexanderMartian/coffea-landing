"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { newsletterSchema, type NewsletterValues } from "@/lib/schemas";

interface NewsletterFormProps {
  placeholder: string;
  cta: string;
  submitting: string;
  success: string;
  errorGeneric: string;
}

export default function NewsletterForm({
  placeholder,
  cta,
  submitting,
  success,
  errorGeneric,
}: NewsletterFormProps) {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(values: NewsletterValues) {
    setServerError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        setDone(true);
        return;
      }
      setServerError(data?.error || errorGeneric);
    } catch {
      setServerError(errorGeneric);
    }
  }

  const emailError = errors.email?.message;

  return (
    <>
      {!done && (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 w-full flex flex-col md:flex-row gap-3"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            {placeholder}
          </label>
          {/* Input pill — data-spec on the pill wrapper to match Figma Frame 20 */}
          <div
            data-spec="newsletter-input"
            className="relative flex items-center w-full min-h-[44px] md:flex-1 3xl:flex-none 3xl:w-[364px] 3xl:h-[44px] rounded-[100px] bg-background pl-6 pr-4 3xl:py-[10px] focus-within:ring-2 focus-within:ring-foreground/60 transition-shadow"
          >
            <Mail
              className="shrink-0 mr-[10px] text-foreground pointer-events-none"
              size={24}
              strokeWidth={2}
            />
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder={placeholder}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? "newsletter-email-error" : undefined}
              className="flex-1 min-w-0 min-h-[44px] 3xl:min-h-0 bg-transparent font-alt font-semibold text-base text-foreground placeholder:text-foreground focus:outline-none autofill:shadow-[inset_0_0_0_1000px_var(--color-background)] autofill:[-webkit-text-fill-color:var(--color-foreground)]"
              {...register("email")}
            />
          </div>
          {/* Honeypot: off-screen (not display:none), skipped by keyboard and screen readers */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-px w-px overflow-hidden"
            {...register("website")}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            data-spec="newsletter-btn"
            className="w-full md:w-auto min-h-[44px] 3xl:w-[138px] 3xl:h-[44px] rounded-[100px] bg-foreground text-background font-alt font-semibold text-base px-7 hover:bg-foreground/90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            {isSubmitting ? submitting : cta}
          </button>
        </form>
      )}

      {!done && emailError && (
        <p id="newsletter-email-error" className="mt-3 font-alt font-semibold text-sm text-foreground">
          {emailError}
        </p>
      )}
      <div role="alert">
        {serverError && (
          <p className="mt-3 font-alt font-semibold text-sm text-foreground">{serverError}</p>
        )}
      </div>

      <div role="status" aria-live="polite" className="w-full">
        {done && (
          <p className="mt-6 min-h-[44px] flex items-center justify-center font-alt font-semibold text-base text-foreground">
            {success}
          </p>
        )}
      </div>
    </>
  );
}

import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address"),
  website: z.string().optional(), // honeypot — must stay empty
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;

import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service."),
  budget: z.string().min(1, "Please select a budget."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
  honeypot: z.string().max(0, "Invalid submission").optional(), // Honeypot field for spam prevention
});

export type ContactFormData = z.infer<typeof contactSchema>;

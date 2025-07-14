// src/schemas/authSchema.ts
import { z } from "zod";

export const authSchema = z.object({
  country: z.string().min(1, "Country is required"),
  phone: z
    .string()
    .min(7, "Phone must be at least 7 digits")
    .max(15, "Phone can't exceed 15 digits")
    .regex(/^\d+$/, "Phone must be digits only"),
});
export type AuthSchema = z.infer<typeof authSchema>;

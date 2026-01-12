import * as z from "zod"
export const changePasswordSchema = z.object({
  password: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
}).refine((data) => data.password !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});
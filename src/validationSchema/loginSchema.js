import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "enter a valid email"
    ),
  password: z
    .string()
    .nonempty("password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password must be minimum of 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

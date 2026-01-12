import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("name is required")
      .min(2, "name must be at least 2 characters or more")
      .max(20, "name must be at most 20 characters"),
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
    rePassword: z.string().nonempty("please confirm your password"),
    gender: z.enum(["male", "female"], { message: "gender is required" }),
    dateOfBirth: z.string().nonempty("date of birth is required")
    .refine(
      (data) => {
        const selectedDate = new Date(data).getFullYear();
        const today = new Date().getFullYear();
        const age = today - selectedDate;
        return age >= 15;
      },
      { message: "age must be at least 15 years old" }
    ),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "passwords do not match",
    path: ["rePassword"],
  });
import * as z from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; 

export const postCommentSchema = z.object({
  content: z
    .string()
    .nonempty("Content is required")
    .min(3, "Content must be at least 3 characters")
    .max(300, "Content must be at most 300 characters")
    .regex(
      /^[\p{L}\p{N}\p{P}\p{S}\p{Emoji}\s]+$/u,
      "Only letters, numbers, emojis, and common punctuation are allowed"
    )
    .optional(),
  body: z
    .string()
    .nonempty("Content is required")
    .min(3, "Content must be at least 3 characters")
    .max(300, "Content must be at most 300 characters")
    .regex(
      /^[\p{L}\p{N}\p{P}\p{S}\p{Emoji}\s]+$/u,
      "Only letters, numbers, emojis, and common punctuation are allowed"
    )
    .optional(),
  image: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      "Image size should be less than 1MB"
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpeg", "image/jpg", "image/png"].includes(files[0]?.type),
      "Only JPEG, JPG, PNG images are allowed"
    ),
}).refine((data) => data.content || data.body, {
  message: "Content is required",
  path: ["content"],
});
import * as z from "zod";
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const uploadImageSchema = z.object({
    photo: z.instanceof(FileList)
.refine((files) => files.length === 1 , "Image is required")
.refine((files) => files[0].size <= MAX_FILE_SIZE, "Image size should be less than 4MB")
.refine((files) =>  ALLOWED_IMAGE_TYPES.includes(files[0].type), "Only JPEG, JPG and PNG images are allowed"),
});
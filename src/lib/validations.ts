import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const walletAuthSchema = z.object({
  walletAddress: z.string().min(42).max(42),
  signature: z.string(),
  message: z.string(),
});

export const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  category: z.enum(["AUTOMOTIVE", "WATCH", "PROPERTY"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description is too long"),
  price: z.coerce.number().positive("Price must be a positive number"),
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
  location: z.string().min(2, "Location is required"),
});


import { z } from "zod";
import { SRI_LANKA_CITIES } from "../constants/index";

// Schema for property form
export const propertyFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  type: z
    .enum(["Residential", "Commercial", "Industrial"], {
      required_error: "Property type is required",
    }),
  description: z
    .string()
    .min(1, "Description is required")
    .refine(
      (val) => {
        const wordCount = val.trim().split(/\s+/).length;
        return wordCount <= 100;
      },
      { message: "Description must be 100 words or less" }
    ),
  address: z.object({
    house: z.string().min(1, "House/building number is required"),
    street: z.string().min(1, "Street is required"),
    city: z
      .string()
      .refine((val) => SRI_LANKA_CITIES.includes(val), {
        message: "Please select a valid city in Sri Lanka",
      }),
    postalCode: z
      .string()
      .min(1, "Postal code is required")
      .regex(/^\d+$/, "Postal code must contain only digits"),
  }),
  forSale: z.boolean(),
  price: z.string().regex(/^[0-9]+$/, "Price must be a non-negative number"),
  discountPrice: z.string().regex(/^[0-9]+$/, "Price must be a non-negative number").optional(),
  beds: z.string().regex(/^[0-9]+$/, "Beds must be a non-negative number"),
  baths: z.string().regex(/^[0-9]+$/, "Baths must be a non-negative number"),  
  options: z.object({
    parkingSpot: z.boolean().optional(),
    furnished: z.boolean().optional(),
  }),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(6, "Maximum 6 images allowed")
    .refine(
      (files) => files.every((file) => file.size <= 2 * 1024 * 1024),
      "Each image must be less than 2MB"
    )
    .refine(
      (files) =>
        files.every((file) =>
          ["image/jpeg", "image/png"].includes(file.type)
        ),
      "Images must be in JPEG or PNG format"
    ),
}).refine((data) => {
  if (data.discountPrice) {
    return Number(data.discountPrice) < Number(data.price);
  }
  return true;
}, {
  message: "Discount price must be less than the regular price",
  path: ["discountPrice"],
});
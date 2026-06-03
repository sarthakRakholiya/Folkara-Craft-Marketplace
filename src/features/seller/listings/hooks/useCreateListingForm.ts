import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const createListingSchema = z.object({
  images: z.array(z.any()).min(1, "At least one image is required").max(3, "You can upload a maximum of 3 images"),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0.01, "Price is required").max(500000, "Price cannot exceed ₹5,00,000"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
  tags: z.array(z.string()).optional(),
});

export type CreateListingSchema = z.infer<typeof createListingSchema>;

export function useCreateListingForm(): UseFormReturn<CreateListingSchema> {
  const form = useForm<CreateListingSchema>({
    resolver: zodResolver(createListingSchema) as any,
    mode: "onChange",
    defaultValues: {
      images: [],
      title: "",
      description: "",
      category: "",
      price: 0,
      quantity: 1,
      tags: [],
    },
  });

  return form;
}

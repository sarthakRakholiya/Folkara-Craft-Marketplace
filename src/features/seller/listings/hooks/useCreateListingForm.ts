import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const createListingSchema = z.object({
  images: z.array(z.any()).min(1, "At least one image is required").max(3, "You can upload a maximum of 3 images"),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0.01, "Price is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  tags: z.array(z.string()).optional(),
});

export type CreateListingSchema = z.infer<typeof createListingSchema>;

export function useCreateListingForm() {
  const form = useForm<CreateListingSchema>({
    resolver: zodResolver(createListingSchema),
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

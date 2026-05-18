import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  deliveryMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["creditCard", "applePay"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "creditCard") {
    if (!data.cardNumber || data.cardNumber.replace(/\s+/g, "").length < 16) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardNumber"],
        message: "Card number must be 16 digits",
      });
    }
    if (!data.expiryDate || !/^\d{2}\/\d{2}$/.test(data.expiryDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryDate"],
        message: "Expiration date must be MM/YY",
      });
    }
    if (!data.cvv || data.cvv.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cvv"],
        message: "CVV must be 3 or 4 digits",
      });
    }
  }
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;

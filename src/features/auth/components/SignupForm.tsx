"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/form/FormInput";
import { signupSchema, type SignupSchema } from "@/validations/auth.validation";

interface SignupFormProps {
  role: string;
}

export function SignupForm({ role }: SignupFormProps) {
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (data: SignupSchema) => {
    console.log("Signup data:", data, "Role:", role);
  };

  const isArtisan = role === "artisan";

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <FormInput
          control={form.control}
          name="email"
          label="Email Address"
          placeholder="hand@crafted.com"
          startIcon={<Mail size={16} />}
        />
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          startIcon={<Lock size={16} />}
        />
        <FormInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          startIcon={<Lock size={16} />}
        />
      </div>
      
      <Button
        variant="primary"
        size="md"
        type="submit"
        className="w-full rounded-full py-6 mt-2 shadow-lg shadow-primary/10"
      >
        {isArtisan ? "Start Selling" : "Start Exploring"}
      </Button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/form/FormInput";
import { signup } from "@/features/auth/actions/auth.actions";
import { signupSchema, type SignupInput } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";

interface SignupFormProps {
  role: string;
}

export function SignupForm({ role }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: role === "artisan" ? "SELLER" : "BUYER",
    },
  });

  useEffect(() => {
    form.setValue("role", role === "artisan" ? "SELLER" : "BUYER");
  }, [role, form]);

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      const res = await signup(data);
      if (res?.error) {
        toast.error(res.error);
      } else {
        queryClient.clear();
      }
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") {
        queryClient.clear();
        return;
      }
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isArtisan = role === "artisan";

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit as any)}>
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
        disabled={isLoading}
        className="w-full rounded-full py-6 mt-2 shadow-lg shadow-primary/10"
      >
        {isLoading ? (
          <span className="flex items-center gap-2 justify-center">
            <Loader2 className="animate-spin" size={18} />
            Creating account...
          </span>
        ) : isArtisan ? (
          "Start Selling"
        ) : (
          "Start Exploring"
        )}
      </Button>
    </form>
  );
}

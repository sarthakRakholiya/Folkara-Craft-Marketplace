"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/form/FormInput";
import { login } from "@/features/auth/actions/auth.actions";
import { loginSchema, type LoginInput } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";

interface LoginFormProps {
  role: string;
}

export function LoginForm({ role: _role }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await login(data, nextParam);
      if (res?.error) {
        toast.error(res.error);
      } else {
        queryClient.clear();
      }
    } catch (error: any) {
      if (error.message === 'NEXT_REDIRECT') {
        queryClient.clear();
        return;
      }
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Signing in...
          </span>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}

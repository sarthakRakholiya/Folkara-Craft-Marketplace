"use client";

import { cn } from "@/lib/utils";

interface AuthHeaderProps {
  mode: string;
  role: string;
}

export function AuthHeader({ mode, role }: AuthHeaderProps) {
  const isLogin = mode === "login";
  const isArtisan = role === "artisan";

  return (
    <header className="text-center mb-8 ">
      <div className="flex items-center justify-center gap-2 mb-4 ">
          <img
            src="/logo.png"
            alt="Folkara Icon"
            className="w-12 h-12 object-contain grayscale"
          />
   
        <img
          src="/logo-name.png"
          alt="Folkara"
          className="h-6 md:h-8 w-auto object-contain md:absolute md:top-8 md:left-8 mb-4 md:mb-0"
        />
      </div>

      <h1 className="font-serif text-3xl text-on-surface mb-2">
        {isLogin ? "Welcome back" : "Create your account"}
      </h1>
      <p className="text-on-surface-variant text-sm">
        {isLogin
          ? "Access your handcrafted marketplace"
          : `Join our community of ${isArtisan ? "creators" : "curators"}`}
      </p>
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";

interface AuthHeaderProps {
  mode: string;
  role: string;
}

export function AuthHeader({ mode, role }: AuthHeaderProps) {
  const isLogin = mode === "login";
  const isArtisan = role === "artisan";

  return (
    <header className="text-center mb-8 ">
      <Link href="/" className="flex items-center justify-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Folkara Icon"
            width={200}
            height={200}
            className="w-12 h-12 object-contain grayscale"
          />
   
        <Image
          src="/logo-name.png"
          alt="Folkara"
          width={500}
          height={100}
          className="h-6 md:h-8 w-auto object-contain md:absolute md:top-8 md:left-8 mb-4 md:mb-0"
        />
      </Link>

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

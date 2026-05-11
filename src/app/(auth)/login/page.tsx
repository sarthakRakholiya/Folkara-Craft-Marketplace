"use client";

import { AuthCarousel } from "@/features/auth/components/AuthCarousel";
import { AuthForm } from "@/features/auth/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left Side: Carousel (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <AuthCarousel />
      </div>

      {/* Right Side: Auth Forms */}
      <main className="w-full lg:w-1/2 h-full overflow-y-auto paper-texture flex flex-col items-center justify-center py-12 px-6 lg:px-20">
        <AuthForm />
      </main>
    </div>
  );
}

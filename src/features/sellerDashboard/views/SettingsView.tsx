"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Shield,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { gsap } from "gsap";
import {
  changePassword,
} from "@/features/auth/actions/profile.actions";
import { changePasswordSchema, type ChangePasswordInput } from "@/features/auth/schemas/password.schema";
import { logout } from "@/features/auth/actions/auth.actions";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export function SettingsView() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const contentRef = React.useRef<HTMLDivElement>(null);
  const iconRef = React.useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  React.useEffect(() => {
    if (isChangingPassword) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(iconRef.current, {
        rotate: 90,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });
      gsap.to(iconRef.current, {
        rotate: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isChangingPassword]);

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsPending(true);
    try {
      const result = await changePassword(data);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Password updated successfully");
        reset();
        setIsChangingPassword(false);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="px-margin-page py-16 max-w-2xl mx-auto">
      <div className="mb-16">
        <h1 className="font-display-lg text-4xl text-primary mb-2">Settings</h1>
        <p className="font-body-lg text-outline italic">
          Manage your security and preferences.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-12">
        {/* Security Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Shield size={18} className="text-primary/40" />
            <h3 className="font-label-caps text-xs tracking-widest text-primary font-bold uppercase">
              Security
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-outline-variant/10 overflow-hidden">
            <div
              className={`flex items-center justify-between p-8 hover:bg-surface-bright transition-colors cursor-pointer group ${isChangingPassword ? "bg-surface-bright" : ""}`}
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              <div>
                <p className="font-label-caps text-[10px] text-outline mb-1 uppercase tracking-widest">
                  Account Password
                </p>
                <p className="font-body-md text-primary font-medium">
                  Change Password
                </p>
              </div>

              <div ref={iconRef}>
                <ChevronRight
                  size={18}
                  className="text-outline group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>

            <div
              ref={contentRef}
              className="overflow-hidden"
              style={{ height: 0, opacity: 0 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="p-10 pt-0 space-y-8">
                <div className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-outline tracking-widest uppercase">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("currentPassword")}
                        type={showCurrentPassword ? "text" : "password"}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 px-6 text-sm font-sans focus:outline-none focus:border-primary/30 transition-all"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCurrentPassword(!showCurrentPassword);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-[10px] text-error font-medium px-2">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-outline tracking-widest uppercase">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("newPassword")}
                        type={showNewPassword ? "text" : "password"}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 px-6 text-sm font-sans focus:outline-none focus:border-primary/30 transition-all"
                        placeholder="Create new password"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNewPassword(!showNewPassword);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-[10px] text-error font-medium px-2">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    shape="full"
                    className="w-full h-14 tracking-widest text-[10px] font-label-caps mt-4"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "UPDATE PASSWORD"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Logout */}
        <div className="pt-8 border-t border-outline-variant/10 flex justify-between items-center">
          <p className="font-body-md text-outline italic">
            Refining your Folkara experience.
          </p>
          <Button
            variant="destructive"
            shape="full"
            onClick={() => setShowLogoutModal(true)}
            className="px-8 h-12 font-label-caps tracking-widest text-[10px]"
          >
            <LogOut size={16} className="mr-2" /> LOGOUT
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out? Your session will be ended securely."
        confirmText="Sign Out"
        cancelText="Keep Creating"
        variant="destructive"
        icon={LogOut}
        isLoading={isLoggingOut}
      />
    </div>
  );
}

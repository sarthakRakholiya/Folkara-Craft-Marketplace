"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export function ProgressProvider({ children }: { children: React.ReactNode }) {

  return (
    <>
      <ProgressBar
        height="4px"
        color="#0e2517"
        options={{ showSpinner: true }}
        shallowRouting={false}
      />
      {children}
    </>
  );
}

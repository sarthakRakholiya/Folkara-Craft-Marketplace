"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useEffect } from "react";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("ProgressProvider mounted");
  }, []);

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

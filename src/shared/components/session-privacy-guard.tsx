"use client";

import { useEffect } from "react";
import { SESSION_CHANNEL } from "@/shared/lib/auth/browser-session";

export function SessionPrivacyGuard() {
  useEffect(() => {
    const hide = () => {
      document.documentElement.style.visibility = "hidden";
    };
    const onPageShow = (event: PageTransitionEvent) => {
      // O histórico não deve reapresentar um painel congelado sem verificar a sessão.
      if (event.persisted) window.location.reload();
    };
    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel(SESSION_CHANNEL);
    if (channel)
      channel.onmessage = (event) => {
        if (event.data !== "signed-out") return;
        hide();
        window.location.replace("/login");
      };
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      channel?.close();
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);
  return null;
}

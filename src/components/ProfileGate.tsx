"use client";

import type { ReactNode } from "react";
import { LinkButton, Panel } from "@/components/ui";
import type { Profile } from "@/lib/types";
import { useActiveProfile } from "@/lib/store";

/** Renders children only when a player profile is selected. */
export function ProfileGate({
  children,
}: {
  // Server pages must pass plain nodes; client components may pass a render function.
  children: ReactNode | ((profile: Profile) => ReactNode);
}) {
  const { profile, ready } = useActiveProfile();

  if (!ready) {
    return <div className="h-40" aria-hidden />;
  }

  if (!profile) {
    return (
      <Panel tone="sun-tint" className="max-w-xl">
        <h2 className="text-2xl font-black">Who is playing?</h2>
        <p className="mt-2 font-semibold text-ink-soft">
          Pick or create a player so your scores and streaks are saved to you.
        </p>
        <div className="mt-5">
          <LinkButton href="/profiles" tone="ink">
            Choose a player
          </LinkButton>
        </div>
      </Panel>
    );
  }

  return <>{typeof children === "function" ? children(profile) : children}</>;
}

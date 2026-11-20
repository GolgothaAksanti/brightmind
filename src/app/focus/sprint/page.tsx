import type { Metadata } from "next";
import { ProfileGate } from "@/components/ProfileGate";
import { Sprint } from "@/components/focus/Sprint";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Focus Sprint" };

export default function SprintPage() {
  return (
    <>
      <PageHeader kind="focus" title="Focus Sprint" back={{ href: "/focus", label: "Focus" }} />
      <ProfileGate><Sprint /></ProfileGate>
    </>
  );
}

import type { Metadata } from "next";
import { ProfileGate } from "@/components/ProfileGate";
import { Target } from "@/components/focus/Target";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Target Hunt" };

export default function TargetPage() {
  return (
    <>
      <PageHeader kind="focus" title="Target Hunt" back={{ href: "/focus", label: "Focus" }} />
      <ProfileGate><Target /></ProfileGate>
    </>
  );
}

import type { Metadata } from "next";
import { ProfileGate } from "@/components/ProfileGate";
import { Patterns } from "@/components/think/Patterns";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Pattern Lab" };

export default function PatternsPage() {
  return (
    <>
      <PageHeader kind="problem" title="Pattern Lab" back={{ href: "/think", label: "Thinking" }} />
      <ProfileGate><Patterns /></ProfileGate>
    </>
  );
}

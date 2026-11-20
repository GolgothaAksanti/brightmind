import type { Metadata } from "next";
import { ProfileGate } from "@/components/ProfileGate";
import { Sequence } from "@/components/focus/Sequence";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Memory Sequence" };

export default function SequencePage() {
  return (
    <>
      <PageHeader kind="focus" title="Memory Sequence" back={{ href: "/focus", label: "Focus" }} />
      <ProfileGate><Sequence /></ProfileGate>
    </>
  );
}

import type { Metadata } from "next";
import { ProfileGate } from "@/components/ProfileGate";
import { CodeCracker } from "@/components/think/CodeCracker";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Code Cracker" };

export default function CodePage() {
  return (
    <>
      <PageHeader kind="problem" title="Code Cracker" back={{ href: "/think", label: "Thinking" }} />
      <ProfileGate><CodeCracker /></ProfileGate>
    </>
  );
}

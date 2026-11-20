import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Studio } from "@/components/writing/Studio";
import { getPrompt, writingPrompts } from "@/lib/content/writing";

export function generateStaticParams() {
  return writingPrompts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/write/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = getPrompt(id);
  return { title: p ? p.title : "Writing" };
}

export default async function WritePromptPage({ params }: PageProps<"/write/[id]">) {
  const { id } = await params;
  if (!getPrompt(id)) notFound();
  return <Studio id={id} />;
}

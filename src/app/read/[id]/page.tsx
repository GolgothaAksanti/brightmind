import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reader } from "@/components/reading/Reader";
import { getPassage, passages } from "@/lib/content/passages";

export function generateStaticParams() {
  return passages.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/read/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = getPassage(id);
  return { title: p ? p.title : "Reading" };
}

export default async function ReadPassagePage({ params }: PageProps<"/read/[id]">) {
  const { id } = await params;
  if (!getPassage(id)) notFound();
  return <Reader id={id} />;
}

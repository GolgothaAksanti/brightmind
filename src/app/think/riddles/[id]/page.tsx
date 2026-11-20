import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileGate } from "@/components/ProfileGate";
import { RiddleRoom } from "@/components/think/RiddleRoom";
import { getRiddle, riddles } from "@/lib/content/riddles";

export function generateStaticParams() {
  return riddles.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/think/riddles/[id]">): Promise<Metadata> {
  const { id } = await params;
  const r = getRiddle(id);
  return { title: r ? r.title : "Riddle" };
}

export default async function RiddlePage({ params }: PageProps<"/think/riddles/[id]">) {
  const { id } = await params;
  if (!getRiddle(id)) notFound();
  return <ProfileGate><RiddleRoom id={id} /></ProfileGate>;
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: {
    default: "BrightMind",
    template: "%s | BrightMind",
  },
  description:
    "Daily reading, writing, focus and problem-solving practice for ages 10 to 12, with a progress dashboard for parents.",
};

export const viewport: Viewport = {
  themeColor: "#f2f5ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}

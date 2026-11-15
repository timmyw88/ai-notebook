import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import HomeView from "@/components/site/HomeView";

export const metadata: Metadata = { alternates: { canonical: absoluteUrl("/") } };

export default function HomePage() {
  return <HomeView page={1} />;
}

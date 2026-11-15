import type { Metadata } from "next";
import SearchResults from "@/components/site/SearchResults";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default function SearchPage() {
  return <SearchResults />;
}

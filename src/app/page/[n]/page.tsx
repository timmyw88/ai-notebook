import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site";
import HomeView from "@/components/site/HomeView";
import { extraPages, getAllPosts } from "@/lib/posts";

type Props = { params: Promise<{ n: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const pages = extraPages(getAllPosts().length).map((n) => ({ n }));
  // Static export needs at least one page; /page/1/ is just a copy of the home page.
  return pages.length ? pages : [{ n: "1" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  return { title: `Page ${n}`, alternates: { canonical: absoluteUrl(n === "1" ? "/" : `/page/${n}/`) } };
}

export default async function HomePageN({ params }: Props) {
  const page = Number((await params).n);
  if (!Number.isInteger(page) || page < 1) notFound();
  return <HomeView page={page} />;
}

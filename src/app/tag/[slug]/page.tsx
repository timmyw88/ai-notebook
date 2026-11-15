import TermArchive, { termMetadata, termParams } from "@/components/site/TermArchive";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => termParams("tag");

export async function generateMetadata({ params }: Props) {
  return termMetadata("tag", (await params).slug, 1);
}

export default async function TagPage({ params }: Props) {
  return <TermArchive kind="tag" slug={(await params).slug} page={1} />;
}

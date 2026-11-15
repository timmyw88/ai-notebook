import TermArchive, { termMetadata, termParams } from "@/components/site/TermArchive";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => termParams("category");

export async function generateMetadata({ params }: Props) {
  return termMetadata("category", (await params).slug, 1);
}

export default async function CategoryPage({ params }: Props) {
  return <TermArchive kind="category" slug={(await params).slug} page={1} />;
}

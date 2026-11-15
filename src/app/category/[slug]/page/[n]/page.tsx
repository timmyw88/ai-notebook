import TermArchive, { termMetadata, termPageParams } from "@/components/site/TermArchive";

type Props = { params: Promise<{ slug: string; n: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => termPageParams("category");

export async function generateMetadata({ params }: Props) {
  const { slug, n } = await params;
  return termMetadata("category", slug, Number(n));
}

export default async function CategoryPageN({ params }: Props) {
  const { slug, n } = await params;
  return <TermArchive kind="category" slug={slug} page={Number(n)} />;
}

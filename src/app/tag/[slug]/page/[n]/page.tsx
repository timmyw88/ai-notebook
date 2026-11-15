import TermArchive, { termMetadata, termPageParams } from "@/components/site/TermArchive";

type Props = { params: Promise<{ slug: string; n: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => termPageParams("tag");

export async function generateMetadata({ params }: Props) {
  const { slug, n } = await params;
  return termMetadata("tag", slug, Number(n));
}

export default async function TagPageN({ params }: Props) {
  const { slug, n } = await params;
  return <TermArchive kind="tag" slug={slug} page={Number(n)} />;
}

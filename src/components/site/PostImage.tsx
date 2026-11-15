import { withBase } from "@/lib/site";

/** Cover image that fills its (relative, sized) parent. Works with local /images/... paths and full URLs. */
export default function PostImage({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBase(src)}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

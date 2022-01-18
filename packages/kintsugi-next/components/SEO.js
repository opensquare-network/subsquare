import { useRouter } from "next/router";
import NextSeo from "components/nextSeo";

export default function SEO({ title, desc, chain, siteUrl }) {
  const route = useRouter();
  const endpoint =
    process.env.NEXT_PUBLIC_PREVIEW_IMG_ENDPOINT ||
    "https://ipfs.fleek.co/ipfs";
  const images = [
    {
      url: `${endpoint}/bafybeid66326gcwrriitsffgrhljk4i7uf54am25arkqjz4j6o3gfwyime`,
      width: 1200,
      height: 628,
    },
  ];

  return (
    <NextSeo
      title={`${title ?? "SubSquare"}`}
      description={desc}
      openGraph={{
        url: `${siteUrl}${route.asPath}`,
        title: title ?? "SubSquare",
        description: desc,
        images,
      }}
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
      }}
    />
  );
}

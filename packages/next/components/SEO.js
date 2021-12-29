import { useRouter } from "next/router";
import NextSeo from "components/nextSeo";

export default function SEO({ title, desc, chain, siteUrl }) {
  const route = useRouter();

  const images = [
    {
      url: `${siteUrl}/imgs/${chain}/1200x628-subsquare-${chain}-twitter.jpg`,
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

import { useRouter } from "next/router";
import NextSeo from "./nextSeo";
import { useChainSettings } from "../context/chain";
import getIpfsLink from "../utils/env/ipfsEndpoint";
import { DEFAULT_SEO_INFO } from "next-common/utils/constants";

export default function SEO({ title: titleProp, desc, ogImage }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const route = useRouter();

  const title = titleProp || DEFAULT_SEO_INFO.title;
  const description = desc || DEFAULT_SEO_INFO.desc;
  const settings = useChainSettings();

  const images = [
    {
      url: ogImage || getIpfsLink(settings.snsCoverCid),
      width: 1200,
      height: 628,
    },
  ];

  return (
    <NextSeo
      title={`${title ?? "SubSquare"}`}
      description={description}
      openGraph={{
        url: `${siteUrl}${route.asPath}`,
        title: title ?? "SubSquare",
        description: desc,
        images,
      }}
      twitter={{
        site: "@site",
        title: title ?? "SubSquare",
        cardType: "summary",
        image: images[0]?.url,
      }}
    />
  );
}

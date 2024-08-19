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

  const { snsCoverCid, snsCoverSmallCid } = settings;

  const images = [
    {
      url: ogImage || getIpfsLink(snsCoverCid),
      width: 1200,
      height: 628,
    },
    /* {
      url: getIpfsLink(snsCoverSmallCid),
      width: 600,
      height: 600,
    }, */
  ].filter(Boolean);

  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        url: `${siteUrl}${route.asPath}`,
        title: title,
        description: desc,
        type: "website",
        images,
      }}
      twitter={{
        title: title,
        cardType: "summary",
        image: getIpfsLink(snsCoverSmallCid),
      }}
    />
  );
}

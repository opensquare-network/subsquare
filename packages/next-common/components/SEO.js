import React from "react";
import { useRouter } from "next/router";
import NextSeo from "./nextSeo";
import { useChainSettings } from "../context/chain";

export default function SEO({ title, desc, ogImage }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const route = useRouter();
  const endpoint =
    process.env.NEXT_PUBLIC_PREVIEW_IMG_ENDPOINT ||
    "https://subsquare.infura-ipfs.io/ipfs";

  const settings = useChainSettings();
  const images = [
    {
      url: ogImage || `${endpoint}/${settings.snsCoverCid}`,
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

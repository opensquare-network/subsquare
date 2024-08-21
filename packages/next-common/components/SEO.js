import { useRouter } from "next/router";
import NextSeo from "./nextSeo";
import { useChainSettings } from "../context/chain";
import { DEFAULT_SEO_INFO } from "next-common/utils/constants";
import { getOpenGraphImages } from "./nextSeo/getOpenGraphImages";

export default function SEO({ title: titleProp, desc, ogImage }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const route = useRouter();

  const title = titleProp || DEFAULT_SEO_INFO.title;
  const description = desc || DEFAULT_SEO_INFO.desc;
  const chainSettings = useChainSettings();

  const ogImages = getOpenGraphImages(chainSettings.value);

  const images = [
    {
      url: ogImage || ogImages.large,
      width: 1200,
      height: 628,
    },
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
        site: "@OpensquareN",
        title: title,
        cardType: "summary_large_image",
        image: ogImages.large,
      }}
    />
  );
}

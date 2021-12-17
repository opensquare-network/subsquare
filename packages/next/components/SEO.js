import { useRouter } from "next/router";
import NextSeo from "components/nextSeo";

export default function SEO({ title, desc, siteUrl }){
  const route = useRouter()

  return <NextSeo
    title={`${title ?? "Subsquare"}`}
    description={desc}
    openGraph={{
      url: `${siteUrl}${route.asPath}`,
      title: title,
      description: desc,
      images: [
        {
          url: `${siteUrl}/imgs/logo.png`,
          width: 1200,
          height: 628,
          alt: 'Og Image Alt',
          type: 'image/jpeg',
        },
        {
          url: `${siteUrl}/imgs/logo4twitter.png`,
          width: 129,
          height: 129,
          alt: 'Og Image Alt Second',
          type: 'image/jpeg',
        },
      ],
      site_name: 'SubSquare',
    }}
    twitter={{
      handle: '@handle',
      site: '@site',
      cardType: 'summary',
    }}
  />;
}

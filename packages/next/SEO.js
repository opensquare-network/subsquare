import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

export default function SEO({title, desc, type = "page"}){
  const route = useRouter()

  // console.log(`${process.env.SITE_URL}${route.asPath}`)
  return <NextSeo
    title={`${title ?? "Subsquare"}`}
    description={desc}
    openGraph={{
      url: `${process.env.SITE_URL}${route.asPath}`,
      title: title,
      description: desc,
      images: [
        {
          url: 'https://test.subsquare.io/imgs/logo.png',
          width: 1200,
          height: 628,
          alt: 'Og Image Alt',
          type: 'image/jpeg',
        },
        {
          url: 'https://test.subsquare.io/imgs/logo4twitter.png',
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

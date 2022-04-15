import React from "react";
import { useRouter } from "next/router";
import NextSeo from "./nextSeo";
import Chains from "../utils/consts/chains";

const imageMap = new Map([
  ["kabocha", "bafybeibind6xq3c3xuu2moy2jr4bmoaodjbyhdgfnrnfo7hkpvotyrhssi"],
  ["acala", "bafybeiafirhri4nsnvxm6usej6fcfyrz4hty5jikupag7fufsniamnyauy"],
  ["bifrost", "bafybeibu7lmjymi5x6gjixdawmc4rjufruc6qwazailfnpzpoaqtuq6khe"],
  ["karura", "bafybeiaoq7r32qsnpjqcey3x5hxfikbq3artjzi32he7dkretvesqgf3ny"],
  ["khala", "bafybeifo4hsd3ue5ivsbcrb77fp2uvglxyc2royqvg52eo5eggnppdjxp4"],
  ["kintsugi", "bafybeid66326gcwrriitsffgrhljk4i7uf54am25arkqjz4j6o3gfwyime"],
  ["interlay", "bafybeifqabzy3677ms2jihcb4ed4kxcvbjtxskctjboidcoy7pbosqrqyi"],
  ["polkadex", "bafybeickjkgii2nnhwyypiem6jjj3z75u4dfknwcmedru4ytzv6qddfg5y"],
  [Chains.crust, "bafybeicb77dwocjcssmcb75irbsvxly4ep335pky2r7tvwsjnoyzpl3c3y"],
  [
    Chains.calamari,
    "bafybeig2mirpdoj3cowecbxiafo335abg3rlz6uhsfficemwtft75ykpqu",
  ],
]);

export default function SEO({ title, desc, chain }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const route = useRouter();
  const endpoint =
    process.env.NEXT_PUBLIC_PREVIEW_IMG_ENDPOINT ||
    "https://ipfs.fleek.co/ipfs";
  const images = [
    {
      url: `${endpoint}/${imageMap.get(chain)}`,
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

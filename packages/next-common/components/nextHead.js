import React from "react";
import Head from "next/head";

export default function NextHead({
  title,
  desc = "MetaDescription",
  type = null,
  url = "",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={desc} />
      {type === "post" && <meta property="og:locale" content="zh_CN" />}
      {type === "post" && <meta property="og:type" content="article" />}
      {type === "post" && <meta property="og:url" content={url} />}
      {type === "post" && <meta property="og:site_name" content="SubSquare" />}
      {type === "post" && <meta property="og:title" content={title} />}
      {type === "post" && <meta property="og:description" content={desc} />}
      {type === "post" && <meta property="twitter:card" content="summary" />}
    </Head>
  );
}

import React from "react";
import ExternalLink from "../externalLink";
import getStorageLink from "../../utils/env/storageLink";

export default function IpfsCidWithLink({ cid }) {
  const text = `${cid.slice(0, 4)}...${cid.slice(-4)}`;
  return (
    <ExternalLink title={cid} href={getStorageLink(cid)}>
      {text}
    </ExternalLink>
  );
}

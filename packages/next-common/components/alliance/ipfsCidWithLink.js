import React from "react";
import ExternalLink from "../externalLink";
import getIpfsLink from "../../utils/env/ipfsEndpoint";

export default function IpfsCidWithLink({ cid }) {
  const text = `${ cid.slice(0, 4) }...${ cid.slice(-4) }`;
  return <ExternalLink
    title={ cid }
    href={ getIpfsLink(cid) }>{ text }</ExternalLink>;
}

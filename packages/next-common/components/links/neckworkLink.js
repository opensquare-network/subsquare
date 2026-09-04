import React from "react";
import { useChain } from "../../context/chain";
import { isNil } from "lodash-es";
import { LinkNeckwork } from "@osn/icons/subsquare";
import IconLink from "./iconLink";
import { getNeckworkDomain } from "next-common/utils/neckwork";

export default function NeckworkLink({
  indexer = {},
  children,
  customDomain = null,
}) {
  const chain = useChain();
  let domain = getNeckworkDomain(chain);

  if (customDomain) {
    domain = customDomain;
  }
  if (!domain) {
    return null;
  }

  const { blockHeight, extrinsicIndex, index, eventIndex } = indexer;
  let url = `https://${domain}.neckwork.net`;
  if (!isNil(extrinsicIndex) || !isNil(index)) {
    url += `/extrinsic/${blockHeight}-${extrinsicIndex ?? index}`;
  } else if (!isNil(eventIndex)) {
    url += `/event/${blockHeight}-${eventIndex}`;
  } else {
    url += `/block/${blockHeight}`;
  }

  if (children) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return <IconLink href={url} icon={<LinkNeckwork />} />;
}

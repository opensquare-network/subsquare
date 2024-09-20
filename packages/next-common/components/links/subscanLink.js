import React from "react";
import { useChain, useChainSettings } from "../../context/chain";
import { isNil } from "lodash-es";
import { LinkSubscan } from "@osn/icons/subsquare";
import IconLink from "./iconLink";

export default function SubScanLink({ indexer = {}, children }) {
  const chain = useChain();
  const { integrations } = useChainSettings();
  if (!integrations?.subscan) {
    return null;
  }

  const domain = integrations.subscan.domain || chain;

  const { blockHeight, extrinsicIndex, index, eventIndex } = indexer;
  let url = `https://${domain}.subscan.io`;
  if (!isNil(extrinsicIndex) || !isNil(index)) {
    url += `/extrinsic/${blockHeight}-${extrinsicIndex ?? index}`;
  } else if (!isNil(eventIndex)) {
    url += `/block/${blockHeight}?tab=event&event=${blockHeight}-${eventIndex}`;
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

  return <IconLink href={url} icon={<LinkSubscan />} />;
}

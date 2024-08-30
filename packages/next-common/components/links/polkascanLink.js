import React from "react";
import { useChainSettings } from "../../context/chain";
import { isNil } from "lodash-es";
import IconLink from "./iconLink";
import dynamic from "next/dynamic";

const LinkPolkascan = dynamic(() =>
  import("@osn/icons/subsquare/LinkPolkascan"),
);

export default function PolkascanLink({ indexer = {}, children }) {
  const { hasPolkascan, polkascanUrl } = useChainSettings();
  if (!hasPolkascan) {
    return null;
  }

  const { blockHeight, extrinsicIndex, index, eventIndex } = indexer;
  let url = polkascanUrl;
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

  return <IconLink href={url} icon={<LinkPolkascan />} />;
}

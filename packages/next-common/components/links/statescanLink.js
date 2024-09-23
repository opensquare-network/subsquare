import React from "react";
import { useChain, useChainSettings } from "../../context/chain";
import { isNil } from "lodash-es";
import Chains from "../../utils/consts/chains";
import IconLink from "./iconLink";
import { LinkStatescan } from "@osn/icons/subsquare";

const statescanDomainMap = {
  [Chains.development]: "gov2",
};

export default function StatescanLink({ indexer, children }) {
  const chain = useChain();
  const { integrations } = useChainSettings();
  if (!integrations?.statescan) {
    return null;
  }

  const { blockHeight, extrinsicIndex, index, eventIndex } = indexer;
  if (
    isNil(extrinsicIndex) &&
    isNil(index) &&
    isNil(eventIndex) &&
    isNil(blockHeight)
  ) {
    return null;
  }

  let url = `https://${statescanDomainMap[chain] || chain}.statescan.io/#`;
  if (!isNil(extrinsicIndex) || !isNil(index)) {
    url += `/extrinsics/${blockHeight}-${extrinsicIndex ?? index}`;
  } else if (!isNil(eventIndex)) {
    url += `/events/${blockHeight}-${eventIndex}`;
  } else {
    url += `/blocks/${blockHeight}`;
  }

  if (children) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return <IconLink href={url} icon={<LinkStatescan />} />;
}

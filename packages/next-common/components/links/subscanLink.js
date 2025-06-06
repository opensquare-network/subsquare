import React from "react";
import { useChain, useChainSettings } from "../../context/chain";
import { isNil } from "lodash-es";
import { LinkSubscan } from "@osn/icons/subsquare";
import IconLink from "./iconLink";

export default function SubScanLink({ indexer = {}, children }) {
  const chain = useChain();
  const { integrations, assethubMigration = {} } = useChainSettings();

  let domain = null;
  if (
    assethubMigration?.migrated &&
    BigInt(indexer.blockTime) >= BigInt(assethubMigration?.timestamp || 0)
  ) {
    domain = assethubMigration?.subscanAssethubDomain || null;
  } else if (integrations?.subscan) {
    domain = integrations.subscan.domain || chain;
  }

  if (!domain) {
    return null;
  }

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

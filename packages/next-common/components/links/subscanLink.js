import React from "react";
import { useChain } from "../../context/chain";
import { isNil } from "lodash-es";
import { LinkSubscan } from "@osn/icons/subsquare";
import IconLink from "./iconLink";
import getChainSettings from "next-common/utils/consts/settings";

export function getSubscanDomain(indexer = {}, chain) {
  const { integrations, assethubMigration = {} } = getChainSettings(chain);

  if (
    assethubMigration?.migrated &&
    indexer?.blockTime != null &&
    BigInt(indexer.blockTime) >= BigInt(assethubMigration?.timestamp || 0)
  ) {
    return assethubMigration?.subscanAssethubDomain || null;
  }

  if (integrations?.subscan) {
    return integrations.subscan.domain || chain;
  }

  return null;
}

export default function SubScanLink({
  indexer = {},
  children,
  customDomain = null,
}) {
  const chain = useChain();
  let domain = getSubscanDomain(indexer, chain);

  if (customDomain) {
    domain = customDomain;
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

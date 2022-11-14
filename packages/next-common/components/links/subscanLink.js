import React from "react";
import LinkSubScanIcon from "../../assets/imgs/icons/link-subscan.svg";
import LinkSubScanIconActive from "../../assets/imgs/icons/link-subscan-active.svg";
import ThirdPartyLink from "./thirdPartyLink";
import { useChain, useChainSettings } from "../../context/chain";
import getChainSettings from "../../utils/consts/settings";
import isNil from "lodash.isnil";

function SubScanLink({ indexer = {} }) {
  const chain = useChain();
  const { noSubscan } = useChainSettings();
  if (noSubscan) {
    return null;
  }

  const { blockHeight, extrinsicIndex, index, eventIndex } = indexer;
  let url = `https://${chain}.subscan.io`;
  if (!isNil(extrinsicIndex) || !isNil(index)) {
    url += `/extrinsic/${blockHeight}-${extrinsicIndex ?? index}`;
  } else {
    url += `/block/${blockHeight}?tab=event&event=${blockHeight}-${eventIndex}`;
  }

  return (
    <ThirdPartyLink href={url} target="_blank" rel="noreferrer">
      <LinkSubScanIcon />
      <LinkSubScanIconActive />
    </ThirdPartyLink>
  );
}

export default SubScanLink;

export function SubScanAccountLink({ address }) {
  const chain = useChain();
  const settings = getChainSettings(chain);
  if (settings.noSubscan) {
    return null;
  }

  return (
    <ThirdPartyLink
      href={`https://${chain}.subscan.io/account/${address}`}
      target="_blank"
      rel="noreferrer"
    >
      <LinkSubScanIcon />
      <LinkSubScanIconActive />
    </ThirdPartyLink>
  );
}

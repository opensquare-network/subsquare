import React from "react";
import LinkSubScanIcon from "../../assets/imgs/icons/link-subscan.svg";
import LinkSubScanIconActive from "../../assets/imgs/icons/link-subscan-active.svg";
import { SubscanLinkWrapper } from "./thirdPartyLink";
import { useChain, useChainSettings } from "../../context/chain";
import isNil from "lodash.isnil";

function SubScanLink({ indexer = {}, children }) {
  const chain = useChain();
  const { noSubscan, subscanDomain } = useChainSettings();
  if (noSubscan) {
    return null;
  }

  console.log("subscanDomain", subscanDomain);
  const { blockHeight, extrinsicIndex, index, eventIndex } = indexer;
  let url = `https://${subscanDomain || chain}.subscan.io`;
  if (!isNil(extrinsicIndex) || !isNil(index)) {
    url += `/extrinsic/${blockHeight}-${extrinsicIndex ?? index}`;
  } else {
    url += `/block/${blockHeight}?tab=event&event=${blockHeight}-${eventIndex}`;
  }

  if (children) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <SubscanLinkWrapper href={url} target="_blank" rel="noreferrer">
      <LinkSubScanIcon />
      <LinkSubScanIconActive />
    </SubscanLinkWrapper>
  );
}

export default SubScanLink;

export function SubScanAccountLink({ address }) {
  const chain = useChain();
  const { noSubscan, subscanDomain } = useChainSettings();
  if (noSubscan) {
    return null;
  }

  return (
    <SubscanLinkWrapper
      href={`https://${subscanDomain || chain}.subscan.io/account/${address}`}
      target="_blank"
      rel="noreferrer"
    >
      <LinkSubScanIcon />
      <LinkSubScanIconActive />
    </SubscanLinkWrapper>
  );
}

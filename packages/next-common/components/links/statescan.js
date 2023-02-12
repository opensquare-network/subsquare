import { useChain, useChainSettings } from "../../context/chain";
import isNil from "lodash.isnil";
import Chains from "../../utils/consts/chains";
import { StatescanLink } from "./thirdPartyLink";
import LinkStatescanLightIcon from "../../assets/imgs/icons/link-statescan-light.svg";
import LinkStatescanDarkIcon from "../../assets/imgs/icons/link-statescan-dark.svg";
import LinkStatescanActiveLight from "../../assets/imgs/icons/link-statescan-active-light.svg";
import LinkStatescanActiveDark from "../../assets/imgs/icons/link-statescan-active-dark.svg";
import React from "react";
import { useThemeMode } from "../../context/theme";

const statescanDomainMap = {
  [Chains.development]: "gov2",
};

export default function Statescan({ indexer, children }) {
  const mode = useThemeMode();
  const chain = useChain();
  const { hasStatescan } = useChainSettings();
  if (!hasStatescan) {
    return null;
  }

  const { blockHeight, extrinsicIndex, index, eventIndex } = indexer;
  if (isNil(extrinsicIndex) && isNil(index) && isNil(eventIndex)) {
    return null;
  }

  let url = `https://${ statescanDomainMap[chain] || chain }.statescan.io/#`;
  if (!isNil(extrinsicIndex) || !isNil(index)) {
    url += `/extrinsics/${ blockHeight }-${ extrinsicIndex ?? index }`;
  } else {
    url += `/events/${ blockHeight }-${ eventIndex }`;
  }

  const isLight = mode === "light";

  if (children) {
    return (
      <a href={ url } target="_blank" rel="noreferrer">
        { children }
      </a>
    );
  }

  return (
    <StatescanLink href={ url } target="_blank" rel="noreferrer">
      { isLight ? <LinkStatescanLightIcon /> : <LinkStatescanDarkIcon /> }
      { isLight ? <LinkStatescanActiveLight /> : <LinkStatescanActiveDark /> }
    </StatescanLink>
  );
}

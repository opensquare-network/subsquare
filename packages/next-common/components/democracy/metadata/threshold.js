import React from "react";
import styled from "styled-components";
import { Chains } from "../../../utils/constants";
import { votingThreshold } from "../../../utils/consts/referendum";
import ExternalLink from "../../../assets/imgs/icons/external-link.svg";

const Wrapper = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;

  & > a {
    margin-left: 10px;
    svg {
      position: relative;
      top: 3px;
    }
  }
`;

export default function Threshold({ chain, threshold = "" }) {
  const lowercase = threshold.toLowerCase();
  let link;
  if (Chains.kintsugi === chain) {
    link =
      "https://docs.interlay.io/#/kintsugi/governance?id=super-majority-against-negative-turnout-bias";
  } else if (votingThreshold.SimpleMajority === lowercase) {
    link =
      "https://wiki.polkadot.network/docs/learn-governance#simple-majority";
  } else if (votingThreshold.SuperMajorityAgainst === lowercase) {
    link =
      "https://wiki.polkadot.network/docs/learn-governance#super-majority-against";
  } else if (votingThreshold.SuperMajorityApprove === lowercase) {
    link =
      "https://wiki.polkadot.network/docs/learn-governance#super-majority-approve";
  }

  return (
    <Wrapper>
      {threshold}
      {link ? (
        <a href={link} target="_blank" rel="noreferrer">
          <ExternalLink />
        </a>
      ) : null}
    </Wrapper>
  );
}

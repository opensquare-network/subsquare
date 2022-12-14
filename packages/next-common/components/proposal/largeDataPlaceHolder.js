import React from "react";
import styled from "styled-components";
import ExternalLink from "../../assets/imgs/icons/external-link.svg";
import { useChain, useChainSettings } from "../../context/chain";
import isNil from "lodash.isnil";

const LargeData = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  color: ${(props) => props.theme.textTertiary};
  gap: 10px;
`;

export default function LargeDataPlaceHolder({
  motionIndex,
  referendumIndex,
  proposalIndex,
}) {
  const chain = useChain();
  const { noSubscan, subscanDomain } = useChainSettings();
  const domain = subscanDomain || chain;
  let subscanLink =
    referendumIndex !== undefined
      ? `https://${domain}.subscan.io/referenda/${referendumIndex}`
      : motionIndex !== undefined
      ? `https://${domain}.subscan.io/council/${motionIndex}`
      : `https://${domain}.subscan.io/democracy_proposal/${proposalIndex}`;

  return (
    <LargeData>
      Large data, please check it on subscan
      {!isNil(referendumIndex) && !noSubscan && (
        <a
          target="_blank"
          rel="noreferrer"
          href={subscanLink}
          style={{ display: "flex" }}
        >
          <ExternalLink />
        </a>
      )}
    </LargeData>
  );
}

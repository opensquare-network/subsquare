import React from "react";
import styled from "styled-components";
import ExternalLink from "../../assets/imgs/icons/external-link.svg";
import { useChain } from "../../context/chain";
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
  let subscanLink =
    referendumIndex !== undefined
      ? `https://${chain}.subscan.io/referenda/${referendumIndex}`
      : motionIndex !== undefined
      ? `https://${chain}.subscan.io/council/${motionIndex}`
      : `https://${chain}.subscan.io/democracy_proposal/${proposalIndex}`;

  return (
    <LargeData>
      Large data, please check it on subscan
      {!isNil(referendumIndex) && (
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

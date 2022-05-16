import styled from "styled-components";
import OpenIcon from "./open.svg";

const LargeData = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  color: #9da9bb;
  gap: 10px;
`;

export default function LargeDataPlaceHolder({
  chain,
  motionIndex,
  referendumIndex,
  proposalIndex,
}) {
  let subscanLink =
    referendumIndex !== undefined
      ? `https://${chain}.subscan.io/referenda/${referendumIndex}`
      : motionIndex !== undefined
      ? `https://${chain}.subscan.io/council/${motionIndex}`
      : `https://${chain}.subscan.io/democracy_proposal/${proposalIndex}`;

  return (
    <LargeData>
      Large data, please check it on subscan
      <a target="_blank" href={subscanLink} style={{ display: "flex" }}>
        <OpenIcon />
      </a>
    </LargeData>
  );
}

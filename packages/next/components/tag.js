import styled from "styled-components";
import {
  TYPE_COUNCIL_MOTION,
  TYPE_FINANCIAL_MOTION,
} from "../utils/viewConstants";

const Wrapper = styled.div`
  padding: 4px 8px;
  background: ${(p) => p.color ?? "#c2c8d5"};
  border-radius: 2px;
  color: #ffffff;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  white-space: nowrap;
`;

const START = "#2196F3";
const ACTIVE = "#0F6FFF";
const POSITIVE = "#4CAF50";
const NEGATIVE = "#F44336";
const END = "#C2C8D5";

const getTagColor = (name) => {
  if (name && name.startsWith("Tipping")) return ACTIVE;
  if (name && name.startsWith("Motion")) return START;
  switch (name) {
    case "Propose Bounty":
    case "Proposed":
    case "Extended":
    case "Opened":
    case "Started":
    case "externalProposeMajority":
    case "Report Awesome":
      return START;
    case "Tipping":
    case "fastTrack":
    case "acceptCurator":
    case "Tip":
    case "Vote":
    case "BountyBecameActive":
      return ACTIVE;
    case "Passed":
    case "Claimed":
    case "BountyClaimed":
    case "Executed":
    case "Tabled":
    case "Awarded":
    case "BountyAwarded":
    case "Approved":
    case "ApproveVoting":
      return POSITIVE;
    case "Rejected":
    case "Retracted":
    case "Slashed":
    case "Disapproved":
    case "NotPassed":
    case "Tip Retracted":
      return NEGATIVE;
  }
  return END;
};

const isMotion = (data) => {
  return data?.status?.value?.includes("Motion");
};

export default function Tag({ name, data, type = "" }) {
  let tag = name;
  if (isMotion(data)) {
    const motionIndex = data?.status?.value?.replace(/^\D+/g, "");
    if (type === TYPE_COUNCIL_MOTION) {
      tag = <a href={`/council/motion/${motionIndex}`}>{name}</a>;
    }
    if (type === TYPE_FINANCIAL_MOTION) {
      tag = (
        <a
          href={`/financial-council/motion/${data.indexer.blockHeight}_${data.hash}`}
        >
          {name}
        </a>
      );
    }
  }
  const color = getTagColor(name);
  return <Wrapper color={color}>{tag}</Wrapper>;
}

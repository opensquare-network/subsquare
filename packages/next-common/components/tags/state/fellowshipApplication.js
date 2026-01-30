import React from "react";
import { ClosedTag, NegativeTag, PositiveTag, ActiveTag } from "./styled";
import {
  fellowshipApplicationStates,
  formattedViewMap,
} from "next-common/utils/consts/fellowship/application";
import Tooltip from "next-common/components/tooltip";

const fellowshipApplicationTagMap = {
  [fellowshipApplicationStates.New]: ActiveTag,
  [fellowshipApplicationStates.Inducted]: PositiveTag,
  [fellowshipApplicationStates.Rejected]: NegativeTag,
  [fellowshipApplicationStates.Invalid]: ClosedTag,
  [fellowshipApplicationStates.TimedOut]: ClosedTag,
  [fellowshipApplicationStates.Closed]: ClosedTag,
};

const tooltipsTextMap = {
  [fellowshipApplicationStates.Inducted]:
    "The applicant has been inducted as a candidate",
  [fellowshipApplicationStates.Rejected]: "The application was rejected",
  [fellowshipApplicationStates.Invalid]:
    "The proposal content format is not valid or miss necessary info",
  [fellowshipApplicationStates.TimedOut]:
    "The applicant failed to get inducted winthin 30 days after application",
  [fellowshipApplicationStates.Closed]: "The application has been closed",
};

export default function FellowshipApplicationTag({ state }) {
  const Tag = fellowshipApplicationTagMap[state] || ClosedTag;

  if (!state || !formattedViewMap[state]) {
    return null;
  }

  const content = tooltipsTextMap[state];

  if (content) {
    return (
      <Tooltip content={content}>
        <Tag>{formattedViewMap[state]}</Tag>
      </Tooltip>
    );
  }

  return <Tag>{formattedViewMap[state]}</Tag>;
}

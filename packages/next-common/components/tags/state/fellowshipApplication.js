import React from "react";
import { ClosedTag, NegativeTag, PositiveTag, ActiveTag } from "./styled";
import {
  finalStateMap,
  formattedViewMap,
} from "next-common/utils/consts/fellowship/application";
import Tooltip from "next-common/components/tooltip";

const fellowshipApplicationTagMap = {
  [finalStateMap.New]: ActiveTag,
  [finalStateMap.Inducted]: PositiveTag,
  [finalStateMap.Rejected]: NegativeTag,
  [finalStateMap.Invalid]: ClosedTag,
  [finalStateMap.Timeout]: ClosedTag,
};

const tooltipsTextMap = {
  [finalStateMap.Inducted]: "The applicant has been inducted as a candidate",
  [finalStateMap.Rejected]: "The application was rejected",
  [finalStateMap.Invalid]:
    "The proposal content format is not valid or miss necessary info",
  [finalStateMap.Timeout]:
    "The applicant failed to get inducted winthin 30 days after application",
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

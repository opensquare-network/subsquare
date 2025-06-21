import React from "react";
import { ClosedTag, NegativeTag, PositiveTag, ActiveTag } from "./styled";
import {
  finalStateMap,
  formattedViewMap,
} from "next-common/utils/consts/fellowship/application";

const fellowshipApplicationTagMap = {
  [finalStateMap.New]: ActiveTag,
  [finalStateMap.Inducted]: PositiveTag,
  [finalStateMap.Rejected]: NegativeTag,
  [finalStateMap.Invalid]: ClosedTag,
  [finalStateMap.Timeout]: ClosedTag,
};

export default function FellowshipApplicationTag({ state }) {
  const Tag = fellowshipApplicationTagMap[state] || ClosedTag;

  if (!state || !formattedViewMap[state]) {
    return null;
  }

  return <Tag>{formattedViewMap[state]}</Tag>;
}

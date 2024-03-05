import React from "react";
import isNil from "lodash.isnil";
import UpdateIcon from "next-common/assets/imgs/icons/line-chart.svg";
import { Info } from "./styled";
import useDuration from "next-common/utils/hooks/useDuration";

export default function PostTime({ data, extra }) {
  const duration = useDuration(data.time);

  if (!data) {
    return;
  }

  if (isNil(data.time)) {
    return;
  }

  return (
    <Info>
      <UpdateIcon />
      <span>{duration}</span>
      {extra}
    </Info>
  );
}

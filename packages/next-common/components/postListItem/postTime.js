import isNil from "lodash.isnil";
import React from "react";
import Flex from "next-common/components/styled/flex";
import UpdateIcon from "next-common/assets/imgs/icons/line-chart.svg";
import { Info } from "./styled";
import useDuration from "next-common/utils/hooks/useDuration";
import ElapseIcon from "./elapseIcon";

export default function PostTime({ data, type }) {
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
      <Flex className="elapseIcon">
        <ElapseIcon data={data} type={type} />
      </Flex>
    </Info>
  );
}

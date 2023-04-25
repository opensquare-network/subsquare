import React from "react";
import { ItemValue, ItemWrapper } from "../../eventInfoCard/infoItem/styled";
import dayjs from "dayjs";

export default function EndDateItem({ timestamp }) {
  return (
    <ItemWrapper>
      <span>End date:</span>
      <ItemValue>{dayjs(timestamp).format("YYYY-MM-DD HH:mm")}</ItemValue>
    </ItemWrapper>
  );
}

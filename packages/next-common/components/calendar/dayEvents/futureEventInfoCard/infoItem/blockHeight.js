import React from "react";
import { ItemWrapper } from "../../eventInfoCard/infoItem/styled";

export default function BlockHeightItem({ blockHeight }) {
  return (
    <ItemWrapper>
      <span>Block height:</span>
      <span>#{blockHeight}</span>
    </ItemWrapper>
  );
}

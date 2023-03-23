import React from "react";
import { ItemValue, ItemWrapper } from "./styled";

export default function CallItem({ proposal }) {
  return (
    <ItemWrapper>
      <span>Call:</span>
      <ItemValue>
        {proposal?.section}#{proposal?.method}
      </ItemValue>
    </ItemWrapper>
  );
}

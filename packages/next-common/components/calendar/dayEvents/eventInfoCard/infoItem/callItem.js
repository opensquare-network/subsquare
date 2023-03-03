import React from "react";
import { ItemWrapper } from "./styled";

export default function CallItem({ proposal }) {
  return (
    <ItemWrapper>
      <span>Call:</span>
      <span>
        {proposal?.section}#{proposal?.method}
      </span>
    </ItemWrapper>
  );
}

import React from "react";
import { ItemValue, ItemWrapper } from "./styled";

export default function DescriptionItem({ description }) {
  return (
    <ItemWrapper>
      <span>Description:</span>
      <ItemValue>{description}</ItemValue>
    </ItemWrapper>
  );
}

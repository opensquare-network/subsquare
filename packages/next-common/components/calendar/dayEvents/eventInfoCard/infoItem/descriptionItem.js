import React from "react";
import { ItemWrapper } from "./styled";

export default function DescriptionItem({ description }) {
  return (
    <ItemWrapper>
      <span>Description:</span>
      <span>{description}</span>
    </ItemWrapper>
  );
}

import React from "react";
import { ItemValue, ItemWrapper } from "./styled";

export default function TitleItem({ title }) {
  if (!title) {
    return null;
  }

  return (
    <ItemWrapper>
      <span>Title:</span>
      <ItemValue>{title}</ItemValue>
    </ItemWrapper>
  );
}

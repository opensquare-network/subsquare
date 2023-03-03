import React from "react";
import { ItemLink, ItemWrapper } from "./styled";
import Link from "next/link";

export default function IndexItem({ index, itemName = "Index", baseUrl = "" }) {
  return (
    <ItemWrapper>
      <span>{itemName}:</span>
      <Link href={`${baseUrl}/${index}`} passHref>
        <ItemLink>#{index}</ItemLink>
      </Link>
    </ItemWrapper>
  );
}

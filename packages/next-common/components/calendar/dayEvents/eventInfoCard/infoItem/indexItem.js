import React from "react";
import { ItemLink, ItemWrapper } from "./styled";
import Link from "next-common/components/link";

export default function IndexItem({
  index,
  itemName = "Index",
  baseUrl = "",
  hrefIndex,
}) {
  const linkIndex = hrefIndex ?? index;

  return (
    <ItemWrapper>
      <span>{itemName}:</span>
      <Link href={`${baseUrl}/${linkIndex}`} passHref>
        <ItemLink>#{index}</ItemLink>
      </Link>
    </ItemWrapper>
  );
}

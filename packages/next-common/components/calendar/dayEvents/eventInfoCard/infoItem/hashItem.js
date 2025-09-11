import React from "react";
import { ItemLink, ItemWrapper } from "./styled";
import Link from "next/link";
import { hashEllipsis } from "../../../../../utils";

export default function HashItem({ hash, itemName = "Hash", baseUrl = "" }) {
  return (
    <ItemWrapper>
      <span>{itemName}:</span>
      <Link href={`${baseUrl}/${hash}`} passHref>
        <ItemLink>#{hashEllipsis(hash)}</ItemLink>
      </Link>
    </ItemWrapper>
  );
}

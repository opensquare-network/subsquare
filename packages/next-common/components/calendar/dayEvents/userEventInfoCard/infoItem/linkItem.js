import React from "react";
import { ItemWrapper, ItemLink } from "../../eventInfoCard/infoItem/styled";
import Link from "next/link";

export default function LinkItem({ link }) {
  return (
    <ItemWrapper>
      <span>Link:</span>
      <Link href={link} passHref>
        <ItemLink>{link}</ItemLink>
      </Link>
    </ItemWrapper>
  );
}

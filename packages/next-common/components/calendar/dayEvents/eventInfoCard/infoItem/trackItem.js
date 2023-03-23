import React from "react";
import Link from "next/link";
import { ItemLink, ItemWrapper } from "./styled";

export default function TrackItem({ track, trackName, baseUrl = "" }) {
  return (
    <ItemWrapper>
      <span>Track:</span>
      <Link href={`${baseUrl}/${track}`} passHref>
        <ItemLink>{trackName}</ItemLink>
      </Link>
    </ItemWrapper>
  );
}

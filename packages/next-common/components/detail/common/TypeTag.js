import React from "react";
import { usePost } from "../../../context/post";
import { detailPageCategory } from "../../../utils/consts/business/category";
import { DemocracyTag, TreasuryTag } from "../../tags/business";
import Link from "next/link";
import Gov2TrackTag from "../../gov2/trackTag";
import LinkInfo from "../../styled/linkInfo";

export default function TypeTag({ type }) {
  const post = usePost();

  let tag;
  if (
    [
      detailPageCategory.DEMOCRACY_PROPOSAL,
      detailPageCategory.DEMOCRACY_EXTERNAL,
      detailPageCategory.DEMOCRACY_REFERENDUM,
    ].includes(type)
  ) {
    tag = <DemocracyTag />;
  } else if (
    [
      detailPageCategory.TREASURY_TIP,
      detailPageCategory.TREASURY_PROPOSAL,
      detailPageCategory.TREASURY_BOUNTY,
      detailPageCategory.TREASURY_CHILD_BOUNTY,
    ].includes(type)
  ) {
    tag = <TreasuryTag />;
  } else if ([detailPageCategory.GOV2_REFERENDUM].includes(type)) {
    const trackName = post.onchainData?.trackInfo?.name;

    tag = (
      <Link href={`/referenda/${trackName}`} passHref>
        <LinkInfo>
          <Gov2TrackTag name={trackName} />
        </LinkInfo>
      </Link>
    );
  }

  if (!tag) {
    return null;
  }

  return <div>{tag}</div>;
}

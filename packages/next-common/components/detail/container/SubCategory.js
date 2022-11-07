import React from "react";
import Link from "next/link";
import Flex from "../../styled/flex";
import LinkInfo from "../../styled/linkInfo";
import { usePost, usePostType } from "../../../context/post";
import { detailPageCategory } from "../../../utils/consts/business/category";
import { parseGov2TrackName } from "../../../utils/gov2";

export default function SubCategory() {
  const detailType = usePostType();
  const post = usePost();

  let subCategory = null;
  if (detailType === detailPageCategory.GOV2_REFERENDUM) {
    const trackName = post.onchainData?.trackInfo?.name;
    subCategory = (
      <Flex>
        <Link href={`/gov2/${trackName}`} passHref>
          <LinkInfo>
            {parseGov2TrackName(trackName)}
          </LinkInfo>
        </Link>
      </Flex>
    );
  }

  return subCategory;
}

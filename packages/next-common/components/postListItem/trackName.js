import React from "react";
import businessCategory from "next-common/utils/consts/business/category";
import Gov2TrackTag from "next-common/components/gov2/trackTag";
import LinkInfo from "next-common/components/styled/linkInfo";
import Link from "next/link";
import { MobileHiddenInfo } from "./styled";

export default function TrackName({ data, type }) {
  if (!data) {
    return;
  }

  if (!data.trackName) {
    return;
  }

  const trackTagLink =
    type === businessCategory.openGovReferenda
      ? `/referenda/tracks/${data.track}`
      : `/fellowship/tracks/${data.track}`;

  return (
    <MobileHiddenInfo>
      <Link href={trackTagLink} passHref legacyBehavior>
        <LinkInfo>
          <Gov2TrackTag name={data.trackName} />
        </LinkInfo>
      </Link>
    </MobileHiddenInfo>
  );
}

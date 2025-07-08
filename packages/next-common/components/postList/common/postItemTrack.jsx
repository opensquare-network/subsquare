import React from "react";
import Link from "next/link";
import { MobileHiddenInfo } from "../styled";
import LinkInfo from "next-common/components/styled/linkInfo";
import Gov2TrackTag from "next-common/components/gov2/trackTag";

export default function PostItemTrack({ data, href }) {
  if (!data.trackName) {
    return null;
  }

  return (
    <MobileHiddenInfo>
      <Link href={href} passHref>
        <LinkInfo>
          <Gov2TrackTag name={data.trackName} id={data.track} />
        </LinkInfo>
      </Link>
    </MobileHiddenInfo>
  );
}

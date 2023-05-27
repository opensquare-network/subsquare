import React from "react";
import { useOnchainData } from "../../../../context/post";
import LinkInfo from "../../../styled/linkInfo";
import Gov2TrackTag from "../../../gov2/trackTag";
import Link from "next/link";

export default function ReferendaPostTrack() {
  const onchain = useOnchainData();
  const { name: trackName, id: trackId } = onchain?.trackInfo || {};
  let href = `/referenda/track/${ trackId }`;

  return <Link href={href} passHref legacyBehavior>
    <LinkInfo>
      <Gov2TrackTag name={trackName} />
    </LinkInfo>
  </Link>;
}

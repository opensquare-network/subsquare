import { useOnchainData } from "../../../../context/post";
import LinkInfo from "../../../styled/linkInfo";
import Gov2TrackTag from "../../../gov2/trackTag";
import React from "react";
import Link from "next-common/components/link";

export default function ReferendaTrack({ section = "referenda" }) {
  const onchain = useOnchainData();
  const { name: trackName, id: trackId } = onchain?.trackInfo || {};
  let href = `/${section}/tracks/${trackId}`;

  return (
    <div>
      <Link href={href} passHref>
        <LinkInfo>
          <Gov2TrackTag name={trackName} id={trackId} />
        </LinkInfo>
      </Link>
    </div>
  );
}

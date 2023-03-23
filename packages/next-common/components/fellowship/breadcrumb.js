import React from "react";
import Breadcrumb from "../_Breadcrumb";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "../detail/common/BreadcrumbWrapper";
import { parseGov2TrackName } from "../../utils/gov2";
import { useTrack } from "../../context/post/gov2/track";
import { usePost } from "../../context/post";

function getBreadcrumbItems(track = {}, referendumIndex) {
  return [
    {
      path: "/fellowship",
      content: "Fellowship",
    },
    {
      path: `/fellowship/track/${track.id}`,
      content: `[${track.id}] ` + parseGov2TrackName(track.name),
    },
    {
      content: (
        <>
          <BreadcrumbHideOnMobileText>Referendum</BreadcrumbHideOnMobileText> #
          {referendumIndex}
        </>
      ),
    },
  ];
}

export default function FellowshipBreadcrumb() {
  const track = useTrack();
  const post = usePost();
  return (
    <BreadcrumbWrapper>
      <Breadcrumb items={getBreadcrumbItems(track, post?.referendumIndex)} />
    </BreadcrumbWrapper>
  );
}

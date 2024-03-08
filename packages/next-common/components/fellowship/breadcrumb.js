import React from "react";
import Breadcrumb from "../_Breadcrumb";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "../detail/common/BreadcrumbWrapper";
import { startCase } from "lodash-es";
import { useTrack } from "../../context/post/gov2/track";
import { usePost } from "../../context/post";

function getBreadcrumbItems(track = {}, referendumIndex) {
  return [
    {
      path: "/fellowship",
      content: "Fellowship",
    },
    {
      path: `/fellowship/tracks/${track.id}`,
      content: `[${track.id}] ` + startCase(track.name),
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

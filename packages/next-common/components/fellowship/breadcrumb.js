import React from "react";
import Breadcrumb from "../_Breadcrumb";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "../detail/common/BreadcrumbWrapper";
import { parseGov2TrackName } from "../../utils/gov2";
import { useTrack } from "../../context/post/gov2/track";

function getBreadcrumbItems(track = {}, referendumIndex) {
  return [
    {
      path: "/fellowship",
      content: "Fellowship",
    },
    {
      path: `/fellowship/track/${track.id}`,
      content: parseGov2TrackName(track.name),
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
  return (
    <BreadcrumbWrapper>
      <Breadcrumb items={getBreadcrumbItems(track, 3)} />
    </BreadcrumbWrapper>
  );
}

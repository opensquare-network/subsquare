import React from "react";
import Breadcrumb from "../_Breadcrumb";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "../detail/common/BreadcrumbWrapper";
import startCase from "lodash.startcase";
import { useTrack } from "../../context/post/gov2/track";
import { usePost } from "../../context/post";

function getBreadcrumbItems(track = {}, referendumIndex) {
  return [
    {
      path: "/referenda",
      content: "Referenda",
    },
    {
      path: `/referenda/tracks/${track.id}`,
      content: startCase(track.name),
    },
    {
      content: (
        <>
          <BreadcrumbHideOnMobileText>Referendum</BreadcrumbHideOnMobileText>{" "}
          {`#${referendumIndex}`}
        </>
      ),
    },
  ];
}

export default function ReferendaBreadcrumb() {
  const track = useTrack();
  const post = usePost();
  return (
    <BreadcrumbWrapper>
      <Breadcrumb items={getBreadcrumbItems(track, post?.referendumIndex)} />
    </BreadcrumbWrapper>
  );
}

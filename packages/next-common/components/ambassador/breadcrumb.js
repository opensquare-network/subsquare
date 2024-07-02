import React from "react";
import Breadcrumb from "../_Breadcrumb";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "../detail/common/BreadcrumbWrapper";
import { startCase } from "lodash-es";

function getBreadcrumbItems(track, referendumIndex) {
  return [
    {
      path: "/ambassador/referenda",
      content: "Ambassador",
    },
    track
      ? {
          path: `/ambassador/tracks/${track.id}`,
          content: `[${track.id}] ` + startCase(track.name),
        }
      : null,
    {
      content: (
        <>
          <BreadcrumbHideOnMobileText>Referendum</BreadcrumbHideOnMobileText> #
          {referendumIndex}
        </>
      ),
    },
  ].filter(Boolean);
}

export default function AmbassadorBreadcrumb({ track, referendumIndex }) {
  return (
    <BreadcrumbWrapper>
      <Breadcrumb items={getBreadcrumbItems(track, referendumIndex)} />
    </BreadcrumbWrapper>
  );
}

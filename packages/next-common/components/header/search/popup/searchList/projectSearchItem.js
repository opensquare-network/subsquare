import { useState } from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import WebLink from "next-common/components/links/webLink";
import TwitterLink from "next-common/components/links/twitterLink";
import { MenuTracks } from "@osn/icons/subsquare";
import { CommonSearchItemContent } from "./commonSearchItem";

import dynamicPopup from "next-common/lib/dynamic/popup";
import { isEmpty, isNil } from "lodash-es";

const ProjectDetailPopup = dynamicPopup(() =>
  import("next-common/components/treasury/projects/projectDetailPopup"),
);

export default function TreasuryFundedProjectSearchItem({ row, onClose }) {
  if (isNil(row?.raw)) {
    return null;
  }
  return <TreasuryFundedProjectSearchItemContent row={row} onClose={onClose} />;
}

function TreasuryFundedProjectSearchItemContent({ row, onClose }) {
  const { raw: project } = row;
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpenPopup(true)}>
        <CommonSearchItemContent
          IconComponent={MenuTracks}
          title={
            <div className="flex items-center gap-1 text14Medium text-textPrimary">
              <span>{project.name}</span>{" "}
              <span className="text-textTertiary">·</span>
              {!isEmpty(project?.links) && (
                <ProjectLinks links={project?.links} />
              )}
              <span className="text-textTertiary">
                Total funded{" "}
                <ValueDisplay
                  value={project.fiatAtFinal}
                  symbol=""
                  prefix="$"
                />
              </span>
            </div>
          }
          content={project.description}
          onClose={onClose}
        />
      </div>
      {openPopup && project && (
        <ProjectDetailPopup
          onClose={() => setOpenPopup(false)}
          selectedProject={project}
        />
      )}
    </>
  );
}

function ProjectLinks({ links }) {
  if (!links) return null;

  return (
    <>
      <div className="flex items-center gap-1">
        {links.website && <WebLink website={links.website} />}
        {links.twitter && <TwitterLink twitter={links.twitter} />}
      </div>
      <span className="text-textTertiary">·</span>
    </>
  );
}

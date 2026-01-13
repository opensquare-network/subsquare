import { useState, useCallback } from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import WebLink from "next-common/components/links/webLink";
import TwitterLink from "next-common/components/links/twitterLink";
import { MenuTracks } from "@osn/icons/subsquare";
import { CommonSearchItemContent } from "./commonSearchItem";

import dynamicPopup from "next-common/lib/dynamic/popup";
import { backendApi } from "next-common/services/nextApi";

const ProjectDetailPopup = dynamicPopup(() =>
  import("next-common/components/treasury/projects/projectDetailPopup"),
);

export default function TreasuryFundedProjectSearchItem({ row, onClose }) {
  const { raw } = row;
  const [project, setProject] = useState(null);
  const [showProjectDetailPopup, setShowProjectDetailPopup] = useState(false);

  const handleProjectClick = useCallback(async () => {
    backendApi
      .fetch(`/treasury/status/projects/detail/${raw.id}`)
      .then((res) => {
        setProject(res.result);
        setShowProjectDetailPopup(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [raw.id]);

  return (
    <>
      <div className="cursor-pointer" onClick={handleProjectClick}>
        <CommonSearchItemContent
          IconComponent={MenuTracks}
          title={
            <div className="flex items-center gap-1 text14Medium text-textPrimary">
              <span>{raw.title}</span>{" "}
              <span className="text-textTertiary">·</span>
              <ProjectLinks links={raw?.links} />
              <span className="text-textTertiary">·</span>
              <span className="text-textTertiary">
                Total funded{" "}
                <ValueDisplay value={raw.fiatAtFinal} symbol="" prefix="$" />
              </span>
            </div>
          }
          content={row.content}
          onClose={onClose}
        />
      </div>
      {showProjectDetailPopup && project && (
        <ProjectDetailPopup
          onClose={() => setShowProjectDetailPopup(false)}
          selectedProject={project}
        />
      )}
    </>
  );
}

function ProjectLinks({ links }) {
  if (!links) return null;

  return (
    <div className="flex items-center gap-1">
      {links.website && <WebLink website={links.website} />}
      {links.twitter && <TwitterLink twitter={links.twitter} />}
    </div>
  );
}

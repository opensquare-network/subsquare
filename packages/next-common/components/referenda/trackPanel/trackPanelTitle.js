import { MenuTracks } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import React from "react";

function TrackPanelTitle() {
  return (
    <div
      className={cn(
        "flex items-center",
        "text14Bold text-textPrimary capitalize",
      )}
    >
      <MenuTracks className="mr-2 w-6 h-6 [&_path]:fill-textSecondary" />
      <span className="group-hover/title:underline">Referenda Tracks</span>
    </div>
  );
}

export default React.memo(TrackPanelTitle);

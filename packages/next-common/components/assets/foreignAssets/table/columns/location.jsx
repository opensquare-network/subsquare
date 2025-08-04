import React, { useState, memo } from "react";
import { InfoDocs } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";

const LocationDetailPopup = dynamicPopup(() =>
  import("next-common/components/callDetailPopup"),
);

function Location({ location }) {
  const [showDetail, setShowDetail] = useState(false);

  const handleClick = () => {
    setShowDetail(true);
  };

  return (
    <>
      <InfoDocs
        role="button"
        className={cn(
          "w-5 h-5 cursor-pointer",
          "[&_path]:fill-textSecondary",
        )}
        onClick={handleClick}
      />
      {showDetail && (
        <LocationDetailPopup
          tableViewData={location}
          jsonViewData={location}
          hasTreeViewData={false}
          setShow={setShowDetail}
          title="Location"
        />
      )}
    </>
  );
}

const MemoLocation = memo(Location);

export const colLocation = {
  name: "Location",
  style: { textAlign: "left", width: "120px" },
  render: (item) => <MemoLocation location={item.location} />,
};

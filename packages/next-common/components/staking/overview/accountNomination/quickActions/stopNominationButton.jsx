import Tooltip from "next-common/components/tooltip";
import { IconButton } from "next-common/components/styled/iconButton";
import { SystemVoteNay } from "@osn/icons/subsquare";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const StopNominationPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountNomination/stopNominationPopup"
  ),
);

export default function StopNominationButton() {
  const [showStopNominationPopup, setShowStopNominationPopup] = useState(false);
  return (
    <>
      <Tooltip content="Stop Nominating">
        <IconButton
          className="text-theme500 bg-theme100 [&_svg_path]:stroke-theme500"
          onClick={() => setShowStopNominationPopup(true)}
        >
          <SystemVoteNay className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {showStopNominationPopup && (
        <StopNominationPopup
          onClose={() => setShowStopNominationPopup(false)}
        />
      )}
    </>
  );
}

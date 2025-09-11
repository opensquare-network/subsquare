import { useState } from "react";
import useAmbassadorCanInductMember from "next-common/hooks/ambassador/core/useAmbassadorCanInductMember";
import Tooltip from "next-common/components/tooltip";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemPlus } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipCoreInductionPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/core/summary/induct/popup"),
);

export default function Induct(props = {}) {
  const [showPopup, setShowPopup] = useState(false);
  const canInductMember = useAmbassadorCanInductMember();

  return (
    <>
      <Tooltip content={!canInductMember && "Only available to ambassadors"}>
        <SecondaryButton
          size="small"
          disabled={!canInductMember}
          onClick={() => setShowPopup(true)}
          iconLeft={<SystemPlus className="inline-flex w-4 h-4 text-current" />}
          {...props}
        >
          Induct
        </SecondaryButton>
      </Tooltip>
      {showPopup && (
        <FellowshipCoreInductionPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}

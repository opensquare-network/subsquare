import { useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemPlus } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import { useFellowshipCanInductMember } from "next-common/hooks/fellowship/useFellowshipCanInductMember";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipCoreInductionPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/core/summary/induct/popup"),
);

/**
 * @param {ButtonProps} props
 */
export default function Induct(props = {}) {
  const [showPopup, setShowPopup] = useState(false);
  const canInductMember = useFellowshipCanInductMember();

  return (
    <>
      <Tooltip
        content={!canInductMember && "Only available to members with rank >= 3"}
      >
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

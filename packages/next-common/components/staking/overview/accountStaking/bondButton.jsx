import Tooltip from "next-common/components/tooltip";
import { IconButton } from "next-common/components/styled/iconButton";
import { SystemPlus } from "@osn/icons/subsquare";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BondExtraPopup = dynamicPopup(() =>
  import("next-common/components/staking/pools/actions/bondExtraPopup"),
);

export function BondButton({ poolId }) {
  const [showBondExtraPopup, setShowBondExtraPopup] = useState(false);
  return (
    <>
      <Tooltip content="Bond Extra">
        <IconButton
          className="text-theme500 bg-theme100"
          onClick={() => setShowBondExtraPopup(true)}
        >
          <SystemPlus className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {showBondExtraPopup && (
        <BondExtraPopup
          poolId={poolId}
          onClose={() => setShowBondExtraPopup(false)}
        />
      )}
    </>
  );
}

import Tooltip from "next-common/components/tooltip";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import IconButton from "next-common/components/iconButton";
import { TrackPromotion } from "@osn/icons/subsquare";
import BigNumber from "bignumber.js";

const ClaimPayoutPopup = dynamicPopup(() =>
  import("next-common/components/staking/pools/actions/claimPayoutPopup"),
);

export default function ClaimableItem({ claimable }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <SummaryItem title="Claimable">
      <div className="flex items-center gap-2">
        <ValueDisplay
          value={toPrecision(claimable || 0, decimals)}
          symbol={symbol}
        />
        <ClaimButton claimable={claimable} />
      </div>
    </SummaryItem>
  );
}

function ClaimButton({ claimable }) {
  const [open, setOpen] = useState(false);

  if (isNil(claimable) || BigNumber(claimable).lte(0)) {
    return null;
  }

  return (
    <>
      <Tooltip content="Claim your claimable rewards">
        <IconButton role="button" onClick={() => setOpen(true)}>
          <TrackPromotion className="w-4 h-4" />
        </IconButton>
      </Tooltip>

      {open && <ClaimPayoutPopup onClose={() => setOpen(false)} />}
    </>
  );
}

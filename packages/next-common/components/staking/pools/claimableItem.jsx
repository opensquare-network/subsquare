import SecondaryButton from "next-common/lib/button/secondary";
import Tooltip from "next-common/components/tooltip";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ClaimPayoutPopup = dynamicPopup(() =>
  import("next-common/components/staking/actions/claimPayoutPopup"),
);

export default function ClaimableItem({ claimable }) {
  const { decimals, symbol } = useChainSettings();

  if (isNil(claimable)) {
    return null;
  }

  return (
    <SummaryItem title="Claimable">
      <div className="flex items-center gap-2">
        <ValueDisplay
          value={toPrecision(claimable, decimals)}
          symbol={symbol}
        />
        <ClaimButton claimable={claimable} />
      </div>
    </SummaryItem>
  );
}

function ClaimButton({ claimable }) {
  const [open, setOpen] = useState(false);
  if (isNil(claimable) || claimable.lte(0)) {
    return null;
  }

  return (
    <>
      <Tooltip content="Claim your claimable rewards">
        <SecondaryButton
          size="small"
          className="h-6"
          onClick={() => setOpen(true)}
        >
          Claim
        </SecondaryButton>
      </Tooltip>

      {open && <ClaimPayoutPopup onClose={() => setOpen(false)} />}
    </>
  );
}

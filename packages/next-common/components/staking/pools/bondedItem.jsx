import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import SecondaryButton from "next-common/lib/button/secondary";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import BigNumber from "bignumber.js";

const UnBondPopup = dynamicPopup(() =>
  import("next-common/components/staking/actions/unBondPopup"),
);

export default function BondedItem({ bonded }) {
  const { decimals, symbol } = useChainSettings();

  if (isNil(bonded)) {
    return null;
  }

  return (
    <SummaryItem title="Bonded">
      <div className="flex items-center gap-2">
        <ValueDisplay value={toPrecision(bonded, decimals)} symbol={symbol} />
        <UnbondButton bonded={bonded} />
      </div>
    </SummaryItem>
  );
}

function UnbondButton({ bonded }) {
  const [open, setOpen] = useState(false);

  if (isNil(bonded) && BigNumber(bonded).gt(0)) {
    return null;
  }

  return (
    <>
      <Tooltip content="Unbond your bonded tokens">
        <SecondaryButton
          size="small"
          className="h-6"
          onClick={() => setOpen(true)}
        >
          Unbond
        </SecondaryButton>
      </Tooltip>
      {open && <UnBondPopup bonded={bonded} onClose={() => setOpen(false)} />}
    </>
  );
}

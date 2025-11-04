import BigNumber from "bignumber.js";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { toPrecision } from "next-common/utils";
import { useMemo, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { SystemMenu } from "@osn/icons/subsquare";
import { ActionIconButton } from "next-common/components/multisigs/styled";

const UnbondingPopup = dynamicPopup(() =>
  import("next-common/components/staking/actions/unbondingPopup"),
);

export default function WithdrawItem({ unbondingEras }) {
  const [open, setOpen] = useState(false);
  const { decimals, symbol } = useChainSettings();
  const { result } = useSubStorage("staking", "activeEra");
  const activeEra = result?.value?.index?.toNumber();

  const statistics = useMemo(() => {
    let total = BigNumber(0);
    let active = BigNumber(0);
    let inactive = BigNumber(0);
    Object.entries(unbondingEras)?.forEach(([era, amount]) => {
      total = total.plus(amount);
      if (era >= activeEra) {
        inactive = inactive.plus(amount);
      } else {
        active = active.plus(amount);
      }
    });
    return {
      total,
      active,
      inactive,
    };
  }, [unbondingEras, activeEra]);

  return (
    <>
      <SummaryItem title="Unbonding">
        <div className="flex items-center gap-2">
          <ValueDisplay
            value={toPrecision(statistics.total, decimals)}
            symbol={symbol}
          />
          <ActionIconButton className="w-6 h-6" onClick={() => setOpen(true)}>
            <SystemMenu className="w-4 h-4" />
          </ActionIconButton>
        </div>
      </SummaryItem>
      {open && (
        <UnbondingPopup
          unbondingEras={unbondingEras}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

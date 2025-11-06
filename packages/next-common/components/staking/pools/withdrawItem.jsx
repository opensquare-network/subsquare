import BigNumber from "bignumber.js";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { toPrecision } from "next-common/utils";
import { useMemo, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { TrackRetention } from "@osn/icons/subsquare";
import { useMyPool } from "./context/myPool";
import IconButton from "next-common/components/iconButton";

const UnbondingPopup = dynamicPopup(() =>
  import("next-common/components/staking/pools/actions/unbondingPopup"),
);

export default function WithdrawItem() {
  const { poolMember } = useMyPool();
  const [open, setOpen] = useState(false);
  const { decimals, symbol } = useChainSettings();
  const { result } = useSubStorage("staking", "activeEra");
  const activeEra = result?.value?.index?.toNumber();
  const unbondingEras = useMemo(
    () => poolMember?.unbondingEras || {},
    [poolMember?.unbondingEras],
  );
  const unbondingList = useMemo(
    () => Object.entries(unbondingEras),
    [unbondingEras],
  );

  const statistics = useMemo(() => {
    let total = BigNumber(0);
    let active = BigNumber(0);
    let inactive = BigNumber(0);
    unbondingList?.forEach(([era, amount]) => {
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
  }, [unbondingList, activeEra]);

  return (
    <>
      <SummaryItem title="Unbonding">
        <div className="flex items-center gap-2">
          <ValueDisplay
            value={toPrecision(statistics.total, decimals)}
            symbol={symbol}
          />
          {unbondingList?.length > 0 && (
            <IconButton role="button" onClick={() => setOpen(true)}>
              <TrackRetention className="w-4 h-4" />
            </IconButton>
          )}
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

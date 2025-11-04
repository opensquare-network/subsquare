import SummaryItem from "next-common/components/summary/layout/item";
import { isNil } from "lodash-es";
import { useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BondExtraPopup = dynamicPopup(() =>
  import("next-common/components/staking/actions/bondExtraPopup"),
);

export default function PoolIdItem({ poolId }) {
  const [showBondExtraPopup, setShowBondExtraPopup] = useState(false);
  if (isNil(poolId)) {
    return null;
  }
  return (
    <>
      <SummaryItem title="My Pool">
        <div className="flex items-center gap-2">
          #{poolId}
          <SecondaryButton
            size="small"
            className="h-6"
            onClick={() => setShowBondExtraPopup(true)}
          >
            Extra
          </SecondaryButton>
        </div>
      </SummaryItem>
      {showBondExtraPopup && (
        <BondExtraPopup
          poolId={poolId}
          onClose={() => setShowBondExtraPopup(false)}
        />
      )}
    </>
  );
}

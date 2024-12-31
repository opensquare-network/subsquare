import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AddressUser from "next-common/components/user/addressUser";
import { useState } from "react";
import Divider from "next-common/components/styled/layout/divider";
import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import AccountLinks from "next-common/components/links/accountLinks";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemMenu } from "@osn/icons/subsquare";
import DemocracyNewDelegation from "next-common/components/summary/democracySummaryDelegation/newDelegation";
import ReferendaDelegationCardSummary from "./summary";
import { DelegateAvatar } from "../referenda/avatar";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubDemocracyDelegating from "next-common/utils/hooks/referenda/useSubDemocracyDelegating";
import dynamicPopup from "next-common/lib/dynamic/popup";
import MineTag from "../common/mineTag";

const ReferendaDelegateeDetailPopup = dynamicPopup(() =>
  import("./detailPopup"),
);

export default function DemocracyDelegateCard({
  delegate = {},
  showDelegateButton = true,
}) {
  const { address, manifesto } = delegate;

  const realAddress = useRealAddress();
  const { delegating } = useSubDemocracyDelegating(realAddress);

  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <SecondaryCard className="flex flex-col text-textPrimary relative">
      {address === realAddress && <MineTag />}

      <div className="flex justify-between">
        <DelegateAvatar address={address} />

        <div className="space-x-2">
          {showDelegateButton && (
            <DemocracyNewDelegation
              disabled={!!delegating}
              defaultTargetAddress={address}
            />
          )}

          <SecondaryButton
            className="w-7 h-7 p-0"
            size="small"
            onClick={() => {
              setDetailOpen(true);
            }}
          >
            <SystemMenu className="w-4 h-4" />
          </SecondaryButton>
        </div>
      </div>
      <div className="flex justify-between mt-3">
        <AddressUser
          add={address}
          showAvatar={false}
          fontSize={14}
          className="[&_.identity]:!font-semibold"
          ellipsis
        />
      </div>

      <div className="mt-3 space-y-3 h-full flex flex-col">
        <Tooltip
          className="block h-full"
          delayDuration={700}
          content={
            manifesto?.shortDescription && (
              <div className="max-w-xs">{manifesto?.shortDescription}</div>
            )
          }
        >
          <div className={cn("text-textTertiary text14Medium", "line-clamp-2")}>
            {manifesto?.shortDescription || "-"}
          </div>
        </Tooltip>

        <AccountLinks address={address} showCouncilorLink={false} />
      </div>

      <Divider className="my-4" />

      <ReferendaDelegationCardSummary
        className="grid-cols-2"
        delegate={delegate}
      />

      {detailOpen && (
        <ReferendaDelegateeDetailPopup
          delegate={delegate}
          setDetailOpen={setDetailOpen}
        />
      )}
    </SecondaryCard>
  );
}

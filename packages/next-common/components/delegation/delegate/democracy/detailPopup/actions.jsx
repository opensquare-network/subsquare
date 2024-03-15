import { SystemEdit2, SystemSubtract } from "@osn/icons/subsquare";
import DemocracyNewDelegation from "next-common/components/summary/democracySummaryDelegation/newDelegation";
import SecondaryButton from "next-common/lib/button/secondary";
import useSubDemocracyDelegating from "next-common/utils/hooks/referenda/useSubDemocracyDelegating";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function DemocracyDelegateeDetailPopupActions({ delegate }) {
  const { address } = delegate;

  const realAddress = useRealAddress();
  const { delegating } = useSubDemocracyDelegating(realAddress);

  const isDelegatee = realAddress === address;

  let content;
  if (isDelegatee) {
    content = <DelegateeActions />;
  } else {
    content = (
      <DemocracyNewDelegation
        disabled={!!delegating}
        defaultTargetAddress={address}
        targetDisabled
      />
    );
  }

  if (!content) {
    return null;
  }

  return <div>{content}</div>;
}

// FIXME: delegation, edit and revoke
function DelegateeActions() {
  return (
    <div className="flex items-center gap-x-2">
      <SecondaryButton
        size="small"
        iconLeft={<SystemEdit2 className="w-4 h-4" />}
      >
        Edit
      </SecondaryButton>
      <SecondaryButton
        size="small"
        iconLeft={<SystemSubtract className="w-4 h-4" />}
      >
        Revoke
      </SecondaryButton>
    </div>
  );
}

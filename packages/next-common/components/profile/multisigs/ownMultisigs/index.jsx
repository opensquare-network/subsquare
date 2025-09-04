import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import MultisigSummary from "next-common/components/profile/multisigs/ownMultisigs/summary";
import { useMultisigContext } from "next-common/components/profile/multisigs/context";
import OwnMultisigsTabs from "next-common/components/profile/multisigs/ownMultisigs/tabs";

function OwnMultisigsContent() {
  return (
    <>
      <MultisigSummary />
      <SecondaryCard>
        <OwnMultisigsTabs />
      </SecondaryCard>
    </>
  );
}

function Empty() {
  return (
    <SecondaryCard className="flex items-center justify-center">
      <span className="text-textTertiary text14Medium">
        {"Can't find multisig records of this address on chain"}
      </span>
    </SecondaryCard>
  );
}

function OwnMultisigsWithNullGuard() {
  const { data } = useMultisigContext();
  if (data?.signatories?.length === 0) {
    return <Empty />;
  }

  return <OwnMultisigsContent />;
}

export default function OwnMultisigs() {
  return (
    <div className="flex flex-col gap-[18px]">
      <OwnMultisigsWithNullGuard />
    </div>
  );
}

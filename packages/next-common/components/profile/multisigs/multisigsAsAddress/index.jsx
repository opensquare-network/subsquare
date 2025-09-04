import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import MultisigSummary from "next-common/components/profile/multisigs/multisigsAsAddress/summary";
import { useMultisigContext } from "next-common/components/profile/multisigs/context";
import MultisigsAsAddressTabs from "next-common/components/profile/multisigs/multisigsAsAddress/tabs";

function MultisigsAsAddressContent() {
  return (
    <>
      <MultisigSummary />
      <SecondaryCard>
        <MultisigsAsAddressTabs />
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

function MultisigsAsAddressWithNullGuard() {
  const { data } = useMultisigContext();
  if (data?.signatories?.length === 0) {
    return <Empty />;
  }

  return <MultisigsAsAddressContent />;
}

export default function MultisigsAsAddress() {
  return (
    <div className="flex flex-col gap-[18px]">
      <MultisigsAsAddressWithNullGuard />
    </div>
  );
}

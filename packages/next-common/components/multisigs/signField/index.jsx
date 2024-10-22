import SignStatusOnProfile from "next-common/components/multisigs/signField/signStatusOnProfile";
import { AccountMultisigPageGuard } from "next-common/components/multisigs/signField/router";
import SignatoryStatus from "next-common/components/multisigs/signField/signatoryStatus";
import SignatoryAction from "next-common/components/multisigs/signField/signatoryAction";

export default function MultisigSignField({ multisig = {} }) {
  return (
    <div className="flex items-center justify-end gap-x-2">
      <SignStatusOnProfile multisig={multisig} />
      <AccountMultisigPageGuard>
        <SignatoryStatus multisig={multisig} />
        <SignatoryAction multisig={multisig} />
      </AccountMultisigPageGuard>
    </div>
  );
}

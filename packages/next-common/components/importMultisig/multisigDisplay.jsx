import { cn } from "next-common/utils";
import Divider from "../styled/layout/divider";
import { AddressUser } from "../user";
import { sortAddresses } from "@polkadot/util-crypto";
import { noop } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { useMemo } from "react";
import { normalizeAddress } from "next-common/utils/address";
import { MultisigAccount } from "../multisigs/styled";

export default function MultisigDisplay({
  multisig,
  children,
  onClick = noop,
  className = "",
  showCopyableAddress = true,
}) {
  const { ss58Format } = useChainSettings();
  const formattedMultisig = useMemo(() => {
    const sortedSignatories = sortAddresses(
      multisig.signatories || [],
      ss58Format,
    );
    return {
      ...multisig,
      address: normalizeAddress(multisig.address || multisig.multisigAddress),
      signatories: sortedSignatories,
    };
  }, [multisig, ss58Format]);
  return (
    <div
      className={cn(
        "border border-neutral400 rounded-lg p-3 cursor-pointer",
        className,
      )}
      onClick={() => {
        onClick(multisig.value);
      }}
    >
      <header className="flex items-center justify-between">
        <MultisigAccount
          multisig={formattedMultisig}
          showCopyableAddress={showCopyableAddress}
        />
        {children}
      </header>
      <div className="ml-14 gap-y-1 flex flex-col">
        <Divider className="!my-2" />
        {formattedMultisig.signatories.map((item) => (
          <div key={item}>
            <AddressUser add={item} className="!text12Medium" avatarSize={20} />
          </div>
        ))}
      </div>
    </div>
  );
}

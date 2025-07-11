import { addressEllipsis, cn } from "next-common/utils";
import Divider from "../styled/layout/divider";
import { AddressUser } from "../user";
import { UserAvatar } from "../relationshipPopup/userNode";
import { noop } from "lodash-es";

function MultisigAccount({ multisig }) {
  const badge = `${multisig.threshold}/${multisig.signatories.length}`;
  const ellipsisAddress = addressEllipsis(multisig.address);
  return (
    <div className="flex items-center gap-x-3">
      <UserAvatar address={multisig.address} badge={badge} />
      <div className="flex flex-col justify-between">
        <div className="text14Medium text-textPrimary">{ellipsisAddress}</div>
        <p className="text12Medium text-textTertiary break-all">
          {multisig.address}
        </p>
      </div>
    </div>
  );
}

export default function MultisigDisplay({
  multisig,
  children,
  onClick = noop,
  className = "",
}) {
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
        <MultisigAccount multisig={multisig} />
        {children}
      </header>
      <div className="ml-14 gap-y-1 flex flex-col">
        <Divider className="!my-2" />
        {multisig.signatories.map((item) => (
          <div key={item}>
            <AddressUser add={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

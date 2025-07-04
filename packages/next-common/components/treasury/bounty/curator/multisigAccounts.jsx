import IndentPanel from "next-common/components/callTreeView/indentPanel";
import { AddressUser } from "next-common/components/user";

export default function MultisigAccounts({ signatories = [] }) {
  if (signatories.length === 0) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      <IndentPanel>
        {signatories.map((address) => (
          <AddressUser key={address} add={address} className="my-1" />
        ))}
      </IndentPanel>
    </div>
  );
}

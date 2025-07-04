import IndentPanel from "next-common/components/callTreeView/indentPanel";
import AccountDisplay from "./accountDisplay";

export default function MultisigAccounts({ signatories = [] }) {
  if (signatories.length === 0) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      <IndentPanel>
        {signatories.map((address) => (
          <AccountDisplay key={address} address={address} />
        ))}
      </IndentPanel>
    </div>
  );
}

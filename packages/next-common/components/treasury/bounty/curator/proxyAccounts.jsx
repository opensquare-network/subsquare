import IndentPanel from "next-common/components/callTreeView/indentPanel";
import AccountDisplay from "./accountDisplay";
import useCuratorInfo from "next-common/hooks/treasury/bounty/useCuratorInfo";
import MultisigAccounts from "./multisigAccounts";

export default function ProxyAccounts({ proxies = [] }) {
  if (!proxies || proxies.length === 0) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      <IndentPanel>
        {proxies.map((proxy) => (
          <div key={proxy.delegate}>
            <CuratorMultisigAccounts address={proxy.delegate} isProxy />
          </div>
        ))}
      </IndentPanel>
    </div>
  );
}

function CuratorMultisigAccounts({ address, isProxy = false }) {
  const { isPure, multisigData, isLoading } = useCuratorInfo(address);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <AccountDisplay
        address={address}
        badge={multisigData?.badge}
        isPure={isPure}
        isProxy={isProxy}
        className="my-1"
      />
      <MultisigAccounts signatories={multisigData?.signatories} />
    </>
  );
}

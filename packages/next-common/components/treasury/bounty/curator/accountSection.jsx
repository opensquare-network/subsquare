import useCuratorInfo from "next-common/hooks/treasury/bounty/useCuratorInfo";
import AddressDisplay from "./addressDisplay";
import IndentPanel from "next-common/components/callTreeView/indentPanel";

const AddressWraper = ({ children, borderBottom = false }) => {
  if (!borderBottom) {
    return children;
  }

  return (
    <div className="flex items-center flex-wrap  space-x-2 h-[44px] mt-0 border-b border-neutral300">
      {children}
    </div>
  );
};

export default function AccountSection({
  address,
  isProxy = false,
  borderBottom = false,
}) {
  const { isPure, multisigData, proxies } = useCuratorInfo(address);

  return (
    <>
      <AddressWraper borderBottom={borderBottom}>
        <AddressDisplay
          address={address}
          isPure={isPure}
          badge={multisigData?.badge}
          isProxy={isProxy}
        />
      </AddressWraper>

      <ProxyAccounts proxies={proxies} />
      <MultisigAccounts signatories={multisigData?.signatories} />
    </>
  );
}

export function MultisigAccounts({ signatories = [] }) {
  if (signatories.length === 0) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      <IndentPanel>
        {signatories.map((address) => (
          <AccountSection key={address} address={address} />
        ))}
      </IndentPanel>
    </div>
  );
}

export function ProxyAccounts({ proxies = [] }) {
  if (!proxies || proxies.length === 0) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      <IndentPanel>
        {proxies.map((proxy) => (
          <div key={proxy.delegate}>
            <AccountSection address={proxy.delegate} isProxy />
          </div>
        ))}
      </IndentPanel>
    </div>
  );
}

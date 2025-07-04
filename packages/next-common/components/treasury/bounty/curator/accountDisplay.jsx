import useCuratorInfo from "next-common/hooks/treasury/bounty/useCuratorInfo";
import AddressDisplay from "./addressDisplay";
import ProxyAccounts from "./proxyAccounts";
import MultisigAccounts from "./multisigAccounts";

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

export default function AccountDisplay({
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

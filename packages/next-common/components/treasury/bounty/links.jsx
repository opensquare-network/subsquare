import SubScanAccountLink from "next-common/components/links/subscanAccountLink";
import StatescanAccountLink from "next-common/components/links/statescanAccountLink";
import IdentityInfoLinks from "next-common/components/links/identityInfoLinks";

export default function CuratorLinks({ address }) {
  if (!address) {
    return null;
  }

  return (
    <div className="flex h-5 space-x-3 pl-[28px] mt-2">
      <StatescanAccountLink address={address} />
      <SubScanAccountLink address={address} />
      <IdentityInfoLinks address={address} />
    </div>
  );
}

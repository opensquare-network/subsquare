import SubScanAccountLink from "next-common/components/links/subscanAccountLink";
import StatescanAccountLink from "next-common/components/links/statescanAccountLink";
import CouncilorLink from "next-common/components/links/councilorLink";
import IdentityInfoLinks from "next-common/components/links/identityInfoLinks";

export default function CuratorLinks({ address, showCouncilorLink = true }) {
  if (!address) {
    return null;
  }

  return (
    <div className="flex h-5 space-x-3 pl-[28px] mt-2">
      <StatescanAccountLink address={address} />
      <SubScanAccountLink address={address} />
      <IdentityInfoLinks address={address} />
      {showCouncilorLink && <CouncilorLink address={address} />}
    </div>
  );
}

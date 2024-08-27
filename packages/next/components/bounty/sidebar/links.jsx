import SubScanAccountLink from "next-common/components/links/subscanAccountLink";
import MailLink from "next-common/components/links/mailLink";
import WebLink from "next-common/components/links/webLink";
import ElementLink from "next-common/components/links/elementLink";
import TwitterLink from "next-common/components/links/twitterLink";
import useIdentity from "next-common/utils/hooks/useIdentity";
import { useChain } from "next-common/context/chain";
import StatescanAccountLink from "next-common/components/links/statescanAccountLink";
import CouncilorLink from "next-common/components/links/councilorLink";

export default function CuratorLinks({ address, showCouncilorLink = true }) {
  const chain = useChain();
  const identity = useIdentity(address, chain);
  const { email, riot, twitter, web } = identity?.info || {};

  if (!address) {
    return null;
  }

  return (
    <div className="flex h-5 space-x-3 pl-[28px] mt-2">
      <StatescanAccountLink address={address} />
      <SubScanAccountLink address={address} />
      {email && <MailLink email={email} />}
      {web && <WebLink website={web} />}
      {riot && <ElementLink riot={riot} />}
      {twitter && <TwitterLink twitter={twitter} />}
      {showCouncilorLink && <CouncilorLink address={address} />}
    </div>
  );
}

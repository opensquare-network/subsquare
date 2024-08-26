import SubScanAccountLink from "next-common/components/links/subscanAccountLink";
import MailLink from "next-common/components/links/mailLink";
import WebLink from "next-common/components/links/webLink";
import ElementLink from "next-common/components/links/elementLink";
import TwitterLink from "next-common/components/links/twitterLink";
import useIdentity from "next-common/utils/hooks/useIdentity";
import { useChain } from "next-common/context/chain";

export default function CuratorLinks({ address }) {
  if (!address) {
    return null;
  }

  const chain = useChain();
  const identity = useIdentity(address, chain);
  const { email, riot, twitter, web } = identity?.info || {};

  return (
    <div className="flex h-5 space-x-3 pl-[28px] mt-2">
      <SubScanAccountLink address={address} />
      {email && <MailLink email={email} />}
      {web && <WebLink website={web} />}
      {riot && <ElementLink riot={riot} />}
      {twitter && <TwitterLink twitter={twitter} />}
    </div>
  );
}

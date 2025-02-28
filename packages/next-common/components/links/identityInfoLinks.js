import React from "react";
import MailLink from "./mailLink";
import WebLink from "./webLink";
import ElementLink from "./elementLink";
import TwitterLink from "./twitterLink";
import useIdentity from "next-common/utils/hooks/useIdentity";
import { useChain } from "next-common/context/chain";

export default function IdentityInfoLinks({ address }) {
  const chain = useChain();
  const identity = useIdentity(address, chain);
  const { email, riot, twitter, web } = identity?.info || {};

  if (!address) {
    throw new Error("No address provided");
  }

  return (
    <>
      {email && <MailLink email={email} />}
      {web && <WebLink website={web} />}
      {riot && <ElementLink riot={riot} />}
      {twitter && <TwitterLink twitter={twitter} />}
    </>
  );
}

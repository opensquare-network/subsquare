import { useChain } from "next-common/context/chain";
import ExternalLink from "./externalLink";

export default function HowOpenGovWorks({ anchor }) {
  const chain = useChain();
  const hereLink = `https://${chain}.subsquare.io/delegation`;
  let link = "https://wiki.polkadot.network/learn/learn-polkadot-opengov";
  if (anchor) {
    link += `#${anchor}`;
  }

  return (
    <span className="text14Medium text-textSecondary">
      Delegate your votes to experts{" "}
      <ExternalLink
        className="font-bold text-theme500"
        externalIcon={false}
        href={hereLink}
        target="_self"
      >
        here
      </ExternalLink>
      ,{" "}
      <ExternalLink
        className="font-bold text-theme500"
        externalIcon={false}
        href={link}
      >
        wiki
      </ExternalLink>
      .
    </span>
  );
}

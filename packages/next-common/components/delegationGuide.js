import ExternalLink from "./externalLink";
import { Link } from "./detail/sidebar/styled";
import supportsDelegation from "next-common/utils/consts/menu/supportsDelegation";

export default function DelegationGuide({ anchor }) {
  const isDelegationEnabled = supportsDelegation();

  if (!isDelegationEnabled) {
    return (
      <span className="text14Medium text-textSecondary">
        Learn how it works, <WikiLink anchor={anchor} />.
      </span>
    );
  }

  return (
    <span className="text14Medium text-textSecondary">
      Delegate your votes to experts{" "}
      <Link
        className="text14Medium font-bold text-theme500"
        externalIcon={false}
        href="/delegation"
        target="_self"
      >
        here
      </Link>
      , <WikiLink anchor={anchor} />.
    </span>
  );
}

function WikiLink({ anchor }) {
  let link = "https://wiki.polkadot.network/learn/learn-polkadot-opengov";
  if (anchor) {
    link += `#${anchor}`;
  }
  return (
    <ExternalLink
      className="font-bold text-theme500"
      externalIcon={false}
      href={link}
    >
      wiki
    </ExternalLink>
  );
}

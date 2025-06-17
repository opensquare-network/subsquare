import ExternalLink from "./externalLink";
import { Link } from "./detail/sidebar/styled";
import supportsDelegation from "next-common/utils/consts/menu/supportsDelegation";
import { HowReferendaWorks } from "next-common/components/howOpenGovWorks";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export default function DelegationGuide({ anchor }) {
  const isDelegationEnabled = supportsDelegation();
  const votingFinishHeight = useReferendumVotingFinishHeight();

  if (!isDelegationEnabled || votingFinishHeight) {
    return <HowReferendaWorks />;
  }

  return (
    <span className="text14Medium text-textSecondary">
      Or do delegation&nbsp;
      <Link
        className="text14Medium font-bold text-theme500 max-md:mx-0"
        externalIcon={false}
        href="/delegation"
        target="_self"
      >
        here
      </Link>
      , check <WikiLink anchor={anchor} />.
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

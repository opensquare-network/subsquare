import ExternalLink from "next-common/components/externalLink";
import {
  Democracy,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function WithAllVotesLink({ children, isReferenda = false }) {
  const address = useRealAddress();

  return (
    <div className="flex items-center justify-between">
      {children}

      <div className="flex ml-6">
        <ExternalLink
          href={`/user/${address}/votes?tab=${
            isReferenda ? Referenda : Democracy
          }`}
          className="text14Medium text-theme500"
        >
          All Votes History
        </ExternalLink>
      </div>
    </div>
  );
}

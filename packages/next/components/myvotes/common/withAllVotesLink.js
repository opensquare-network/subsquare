import ExternalLink from "next-common/components/externalLink";
import {
  Democracy,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import { cn } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function WithAllVotesLink({ children, isReferenda = false }) {
  const address = useRealAddress();

  return (
    <div
      className={cn(
        "flex items-center justify-between mx-6",
        "max-sm:flex-col max-sm:gap-y-3 max-sm:items-start",
      )}
    >
      {children}

      <div className="flex">
        <ExternalLink
          href={`/user/${address}/votes?type=${
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

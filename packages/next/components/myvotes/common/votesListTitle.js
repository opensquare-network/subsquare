import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import { Title } from "../styled";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import ExternalLink from "next-common/components/externalLink";
import {
  Democracy,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
export default function VotesListTitle({ length }) {
  const isReferenda = useIsReferenda();
  const address = useRealAddress();

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <Title>On-chain Votes</Title>
        <span className="text-textTertiary">{length || 0}</span>
      </div>

      <div className="flex">
        <ExternalLink
          href={`/user/${address}/votes?defaultTab=${
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

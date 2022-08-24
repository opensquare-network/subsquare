import VoteBar from "components/referenda/voteBar";
import useMaybeFetchReferendumStatus from "next-common/utils/hooks/referenda/useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "next-common/utils/hooks/referenda/useMaybeFetchElectorate";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";

export default function TimelineReferendumVote({ referendum, chain }) {
  const api = useApi(chain);
  const { referendumStatus } = useMaybeFetchReferendumStatus(referendum, api);
  const electorate = useMaybeFetchElectorate(referendum, api);

  return (
    <VoteBar
      thin={true}
      tally={referendumStatus?.tally}
      electorate={electorate}
      threshold={referendumStatus?.threshold}
    />
  );
}

import VoteBar from "components/referenda/voteBar";
import useMaybeFetchReferendumStatus from "./useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "./useMaybeFetchElectorate";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";

export default function TimelineReferendumVote({ referendum, chain }) {
  const api = useApi(chain);
  const referendumStatus = useMaybeFetchReferendumStatus(referendum, api);
  const electorate = useMaybeFetchElectorate(referendum, referendumStatus, api);

  return (
    <VoteBar
      thin={true}
      tally={referendumStatus?.tally}
      electorate={electorate}
      threshold={referendumStatus?.threshold}
    />
  );
}

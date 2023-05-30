import VoteBar from "next-common/components/referenda/voteBar";
import useMaybeFetchReferendumStatus from "./useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "./useMaybeFetchElectorate";
import useApi from "next-common/utils/hooks/useApi";

export default function TimelineReferendumVote({ referendum }) {
  const api = useApi();
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

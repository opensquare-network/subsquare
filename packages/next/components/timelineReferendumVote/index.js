import VoteBar from "next-common/components/referenda/voteBar";
import useMaybeFetchReferendumStatus from "./useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "./useMaybeFetchElectorate";
import { useContextApi } from "next-common/context/api";

export default function TimelineReferendumVote({ referendum }) {
  const api = useContextApi();
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

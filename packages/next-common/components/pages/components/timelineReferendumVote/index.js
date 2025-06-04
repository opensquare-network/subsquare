import VoteBar from "next-common/components/referenda/voteBar";
import useMaybeFetchReferendumStatus from "./useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "./useMaybeFetchElectorate";

export default function TimelineReferendumVote({ referendum }) {
  const referendumStatus = useMaybeFetchReferendumStatus(referendum);
  const electorate = useMaybeFetchElectorate(referendumStatus);

  return (
    <VoteBar
      thin={true}
      tally={referendumStatus?.tally}
      electorate={electorate}
      threshold={referendumStatus?.threshold}
    />
  );
}

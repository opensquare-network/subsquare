import VoteBar from "next-common/components/referenda/voteBar";
import useMaybeFetchReferendumStatus from "./useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "./useMaybeFetchElectorate";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import extractVoteInfo from "next-common/utils/democracy/referendum";

function TimelineReferendumVoteImpl({ referendum }) {
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

export default function TimelineReferendumVote({ referendum }) {
  const { voteFinishedIndexer } = extractVoteInfo(referendum?.timeline);
  return (
    <MigrationConditionalApiProvider indexer={voteFinishedIndexer}>
      <TimelineReferendumVoteImpl referendum={referendum} />
    </MigrationConditionalApiProvider>
  );
}

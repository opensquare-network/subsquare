import VoteBar from "next-common/components/referenda/voteBar";
import useReferendumStatus from "./useReferendumStatus";
import useMaybeFetchElectorate from "./useMaybeFetchElectorate";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import extractVoteInfo from "next-common/utils/democracy/referendum";

function TimelineOngoingReferendumVoteImpl({ referendum }) {
  const referendumStatus = useReferendumStatus(referendum);
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

function TimelineEndedReferendumVoteImpl({ referendum }) {
  const referendumStatus =
    referendum?.status || referendum?.info?.ongoing || referendum?.meta;

  const tally = referendumStatus?.tally;
  const electorate = referendumStatus?.tally?.electorate;
  const threshold = referendumStatus?.threshold;

  return (
    <VoteBar
      thin={true}
      tally={tally}
      electorate={electorate}
      threshold={threshold}
    />
  );
}

export default function TimelineReferendumVote({ referendum }) {
  const { voteFinished, voteFinishedIndexer } = extractVoteInfo(
    referendum?.timeline,
  );

  if (voteFinished) {
    return <TimelineEndedReferendumVoteImpl referendum={referendum} />;
  }

  return (
    <MigrationConditionalApiProvider indexer={voteFinishedIndexer}>
      <TimelineOngoingReferendumVoteImpl referendum={referendum} />
    </MigrationConditionalApiProvider>
  );
}

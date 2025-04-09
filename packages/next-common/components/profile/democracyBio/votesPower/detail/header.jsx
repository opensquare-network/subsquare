import { useDemocracyVotesPowerContext } from "../../context/votesPower";
import { VotesPowerContent } from "next-common/components/profile/OpenGovBio/votesPower/valueDisplay";
import CommonPanel from "next-common/components/profile/bio/commonPanel";

export default function DemocracyVotesPowerDetailHeader() {
  const { isLoading, votesPower } = useDemocracyVotesPowerContext();

  return (
    <CommonPanel>
      <VotesPowerContent
        isLoading={isLoading}
        votesPower={votesPower}
        isReferenda={false}
      />
    </CommonPanel>
  );
}

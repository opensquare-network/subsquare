import { useDemocracyVotesPowerContext } from "../../context/votesPower";
import { VotesPowerContent } from "next-common/components/profile/OpenGovBio/votesPower/valueDisplay";
import VotesPowerPanelWrapper from "next-common/components/profile/OpenGovBio/votesPower/panel";

export default function DemocracyVotesPowerDetailHeader() {
  const { isLoading, votesPower } = useDemocracyVotesPowerContext();

  return (
    <VotesPowerPanelWrapper>
      <VotesPowerContent
        isLoading={isLoading}
        votesPower={votesPower}
        isReferenda={false}
      />
    </VotesPowerPanelWrapper>
  );
}

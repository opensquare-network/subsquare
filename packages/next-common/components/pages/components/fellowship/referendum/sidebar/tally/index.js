import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Aye from "./aye";
import Nay from "./nay";
import BareAye from "./bareAye";
import MaxVoters from "./maxVoters";
import SupportBar from "../../../../gov2/sidebar/tally/supportBar";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import VoteBar from "next-common/components/referenda/voteBar";
import useFellowshipVotes from "next-common/utils/hooks/fellowship/useFellowshipVotes";
import { useOnchainData } from "next-common/context/post";
import useFellowshipPerbill from "next-common/utils/hooks/fellowship/useFellowshipPerbill";
import CurvePopupOpener from "next-common/components/gov2/referendum/curvePopup";
import Calls from "./voteCalls";
import { useChainSettings } from "next-common/context/chain";
import { useFellowshipReferendumTally } from "next-common/hooks/fellowship/useFellowshipReferendumInfo";
import {
  useApprovalPercentage,
  useSupportPercentage,
} from "next-common/context/post/gov2/percentage";
import ConfirmationEstimation from "next-common/components/tally/confirmationEstimation";
import EligibleVoters from "./eligibleVoters";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const Footer = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: 16px;
  }
  margin-top: 16px;
`;

export default function FellowshipTally() {
  const indexer = useReferendumVotingFinishIndexer();

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <FellowshipTallyWithContext />
    </MigrationConditionalApiProvider>
  );
}

function FellowshipTallyWithContext() {
  const tally = useFellowshipReferendumTally();
  const approvalThreshold = useApprovalThreshold();
  const { useVoteCall } = useChainSettings();

  const { referendumIndex } = useOnchainData();
  useFellowshipVotes(referendumIndex);
  const supportPerbill = useFellowshipPerbill();

  const approvalPercentage = useApprovalPercentage(tally);
  const supportPercentage = useSupportPercentage(supportPerbill);

  return (
    <SecondaryCardDetail>
      <Title className="!px-0">
        Tally
        <CurvePopupOpener
          tally={tally}
          supportPerbill={supportPerbill}
          isFellowship={true}
        />
      </Title>

      <VoteBar
        tally={tally}
        threshold="percentage"
        percentage={approvalThreshold}
      />
      <Aye value={tally.ayes} />
      <Nay value={tally.nays} />

      <SupportBar supportPerbill={supportPerbill} />
      <BareAye value={tally.bareAyes} />
      <MaxVoters />
      <ConfirmationEstimation
        approvePercentage={approvalPercentage}
        supportPercentage={supportPercentage}
      />

      <Footer className="justify-end">
        <EligibleVoters />
        {useVoteCall && <Calls />}
      </Footer>
    </SecondaryCardDetail>
  );
}

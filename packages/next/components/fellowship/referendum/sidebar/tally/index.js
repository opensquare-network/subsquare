import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Aye from "./aye";
import Nay from "./nay";
import BareAye from "./bareAye";
import MaxVoters from "./maxVoters";
import SupportBar from "../../../../gov2/sidebar/tally/supportBar";
import { useTally } from "next-common/context/post/gov2/referendum";
import useMaxVoters from "next-common/context/post/fellowship/useMaxVoters";
import useApprovalThreshold from "../../../../gov2/sidebar/tally/threshold/useApprovalThreshold";
import VoteBar from "../../../../referenda/voteBar";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

export default function FellowshipTally() {
  const tally = useTally();
  const maxVoters = useMaxVoters();
  const approvalThreshold = useApprovalThreshold();

  return (
    <SecondaryCardDetail>
      <Title>Tally</Title>

      <VoteBar
        tally={tally}
        threshold="percentage"
        percentage={approvalThreshold}
      />
      <Aye />
      <Nay />

      <SupportBar support={tally?.bareAyes} issuance={maxVoters} />
      <BareAye />
      <MaxVoters />
    </SecondaryCardDetail>
  );
}

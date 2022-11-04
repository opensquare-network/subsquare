import TallyInfo from "components/referenda/tallyInfo";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { votesSelector } from "next-common/store/reducers/referendumSlice";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

export default function Gov2Tally({ detail, chain }) {
  const { allAye = [], allNay = [] } = useSelector(votesSelector);

  return (
    <div>
      <SecondaryCardDetail>
        <Title>Tally</Title>
        <TallyInfo chain={chain} allAye={allAye} allNay={allNay} />
      </SecondaryCardDetail>
    </div>
  );
}

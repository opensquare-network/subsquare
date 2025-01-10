import styled from "styled-components";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
  padding-left: 0;
  padding-right: 0;
`;

export default function MyVoteTitle({ type }) {
  return (
    <Title>
      My Vote
      <span className="text-textTertiary text14Medium">{type}</span>
    </Title>
  );
}

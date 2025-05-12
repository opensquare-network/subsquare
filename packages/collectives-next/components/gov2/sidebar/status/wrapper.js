import styled from "styled-components";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";

const Wrapper = styled.div``;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
  padding-left: 0;
  padding-right: 0;
`;

export default function StatusWrapper({ children, titleExtra }) {
  return (
    <Wrapper>
      <SecondaryCardDetail>
        <Title className="flex justify-between">
          Status
          {titleExtra}
        </Title>
        {children}
      </SecondaryCardDetail>
    </Wrapper>
  );
}

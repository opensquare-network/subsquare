import styled from "styled-components";

import Layout from "components/layout";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

export default function Account() {
  return (
    <Layout>
      <Wrapper>
        <Title>Account</Title>
      </Wrapper>
    </Layout>
  );
}

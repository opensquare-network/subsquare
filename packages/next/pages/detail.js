import styled from "styled-components";

import Layout from "components/layout";
import Back from "components/back";
import DetailItem from "components/detailItem";
import { detailData } from "utils/data";
import Timeline from "components/timeline";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

export default function Detail() {
  return (
    <Layout>
      <Wrapper>
        <Back />
        <DetailItem data={detailData} />
        <Timeline />
      </Wrapper>
    </Layout>
  );
}

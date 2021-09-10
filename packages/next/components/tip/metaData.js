import styled from "styled-components";
import Links from "../timeline/links";
import User from "../user";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: start;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef4;
`;
const Header = styled.div`
  width: 128px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  flex: none;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #1e2134;
  word-break: break-all;
`;

function MetaData({ metadata, chain, indexer }) {
  if (!metadata) {
    return null;
  }

  console.log({ metadata });

  return (
    <Wrapper>
      <Title>Metadata</Title>
      <Row>
        <Header>Reason</Header>
        <Content>{metadata.reason}</Content>
      </Row>
      <Row>
        <Header>Hash</Header>
        <Content>{metadata.hash}</Content>
      </Row>
      <Row>
        <Header>Finder</Header>
        <Content>
          <User chain={chain} add={metadata.finder} fontSize={14} />
          <Links chain={chain} indexer={indexer} style={{ marginLeft: 8 }} />
        </Content>
      </Row>
      <Row>
        <Header>Beneficiary</Header>
        <Content>
          <User chain={chain} add={metadata.who} fontSize={14} />
          <Links chain={chain} indexer={indexer} style={{ marginLeft: 8 }} />
        </Content>
      </Row>
    </Wrapper>
  );
}

export default MetaData;

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
  @media screen and (max-width: 600px) {
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
  border-bottom: 1px solid #EBEEF4;
`
const Header = styled.div`
  width: 128px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  flex: none;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #1E2134;
  word-break: break-all;

  svg:first-child {
    margin-right: 4px;
  }
`


function MetaData({metadata, chain}) {
  if (!metadata) {
    return null;
  }

  return <Wrapper>
    <Title>Metadata</Title>
    <Row>
      <Header>
        Reason
      </Header>
      <Content>
        {metadata.reason}
      </Content>
    </Row>
    <Row>
      <Header>
        Hash
      </Header>
      <Content>
        {metadata.hash}
      </Content>
    </Row>
    <Row>
      <Header>
        Finder
      </Header>
      <Content>
        <User add={metadata.finder} fontSize={12}/>
        <Links chain={chain} address={metadata.finder} style={{marginLeft: 8}}/>
      </Content>
    </Row>
    <Row>
      <Header>
        Beneficiary
      </Header>
      <Content>
        <User add={metadata.who} fontSize={12}/>
        <Links chain={chain} address={metadata.who} style={{marginLeft: 8}}/>
      </Content>
    </Row>
  </Wrapper>
}

export default MetaData;

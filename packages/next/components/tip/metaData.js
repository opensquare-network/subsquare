import styled from "styled-components";
import Avatar from "../avatar";
import { useEffect, useState } from "react";
import { nodes } from "../../utils/constants";
import { fetchIdentity } from "../../services/identity";
import { encodeAddressToChain } from "../../services/address";
import Identity from "../user/identity";
import { addressEllipsis } from "../../utils";

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
  line-height: 140%;
  flex: none;
`

const Content = styled.div`
  display: flex;
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

const Username = styled.span`
  font-size: 12px;
  font-weight: 600;
  word-break: break-all;
  cursor: default;
`;


function MetaData({metadata, chain}) {
  if (!metadata) {
    return null;
  }

  const [finderIdentity, setIdentity] = useState(null);
  const [beneficiryIdentity, setBeneficiryIdentity] = useState(null);

  useEffect(() => {
    setIdentity(null);
    if (metadata.finder) {
      const relayChain = nodes.find(n => n.value === chain)?.relay;
      if (!relayChain) return;

      fetchIdentity(
        relayChain,
        encodeAddressToChain(metadata.finder, relayChain)
      ).then(identity => setIdentity(identity));
    }
    if (metadata.who) {
      const relayChain = nodes.find(n => n.value === chain)?.relay;
      if (!relayChain) return;

      fetchIdentity(
        relayChain,
        encodeAddressToChain(metadata.who, relayChain)
      ).then(identity => setBeneficiryIdentity(identity));
    }
  }, [metadata]);

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
        <Avatar address={metadata.finder} size={20}/>
        {finderIdentity ? (
          <Identity identity={finderIdentity}/>
        ) : (
          <Username>{addressEllipsis(metadata.finder)}</Username>
        )}
      </Content>
    </Row>
    <Row>
      <Header>
        Beneficiary
      </Header>
      <Content>
        <Avatar address={metadata.who} size={20}/>
        {beneficiryIdentity ? (
          <Identity identity={beneficiryIdentity}/>
        ) : (
          <Username>{addressEllipsis(metadata.who)}</Username>
        )}
      </Content>
    </Row>
  </Wrapper>
}

export default MetaData;

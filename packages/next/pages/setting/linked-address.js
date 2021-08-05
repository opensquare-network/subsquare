import styled, { css } from "styled-components";

import Layout from "components/layout";
import Button from "components/button";
import { linkedAddressData } from "utils/data";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
  }
`;

const InfoWrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  line-height: 150%;
  margin-bottom: 16px;
  color: #506176;
`;

const Label = styled.div`
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 12px;
`;

const Divider = styled.div`
  background: #ebeef4;
  height: 1px;
  margin: 24px 0;
`;

const AddressWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const AddressItem = styled.div`
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
  > img:first-child {
    width: 32px;
    height: 32px;
  }
  ${(p) =>
    p.linked &&
    css`
      background: #f6f7fa;
      border-color: #f6f7fa;
    `}
`;

const NameWrapper = styled.div`
  flex-grow: 1;
  > :last-child {
    margin-top: 4px;
    color: #9da9bb;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  color: #506176;
  > img {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    filter: invert(37%) sepia(13%) saturate(941%) hue-rotate(173deg)
      brightness(92%) contrast(86%);
  }
`;

export default function LinkedAddress() {
  const current = linkedAddressData[0];

  return (
    <Layout>
      <Wrapper>
        <Title>Linked address</Title>
        <ContentWrapper>
          <div>
            <InfoWrapper>{`Associate your account with an on-chain address using the Polkadot{.js} extension.`}</InfoWrapper>
            <Button secondary>Show available accounts</Button>
          </div>
          <Divider />
          <div>
            <Label>Address</Label>
            <AddressWrapper>
              {linkedAddressData.map((item, index) => (
                <AddressItem key={index} linked={item.name === current.name}>
                  <img src="/imgs/icons/avatar.svg" />
                  <NameWrapper>
                    <div>{item.name}</div>
                    <div>{item.address}</div>
                  </NameWrapper>
                  <LinkWrapper>
                    <img
                      src={
                        item.name === current.name
                          ? "/imgs/icons/link-linked.svg"
                          : "/imgs/icons/link-unlink.svg"
                      }
                    />
                    <div>
                      {item.name === current.name ? "Linked" : "Unlink"}
                    </div>
                  </LinkWrapper>
                </AddressItem>
              ))}
            </AddressWrapper>
          </div>
        </ContentWrapper>
      </Wrapper>
    </Layout>
  );
}

import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";
import User from "next-common/components/user";
import { getNode, toPrecision } from "utils";
import Loading from "next-common/components/loading";
import SecondaryButton from "next-common/components/buttons/secondaryButton";

const Popup = dynamic(() => import("./popup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  width: 300px;
  margin-top: 0 !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
`;

const Content = styled.div`
  padding: 24px;
  background: ${(props) => props.theme.grey200Border};
  border-radius: 6px;
  color: ${(props) => props.theme.textSecondary};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  > :first-child {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
  }
  > :last-child {
    display: flex;
    align-items: center;
  }
`;

const NoTippers = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 140%;
  color: ${(props) => props.theme.textTertiary};
`;

const Description = styled.div`
  font-size: 12px;
  line-height: 140%;
  color: ${(props) => props.theme.textTertiary};
  > span {
    color: ${(props) => props.theme.primaryPurple500};
    cursor: pointer;
  }
`;

const TipperList = styled.div`
  padding: 8px 0px;
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const TipperItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  line-height: 100%;
  color: ${(props) => props.theme.textSecondary};
  > :last-child {
    white-space: nowrap;
  }
`;

const LoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Tipper({
  chain,
  tipIsFinal = false,
  userIsTipper = false,
  loading = true,
  tips = [],
  councilTippers = [],
  tipHash,
  updateTips = () => {},
  updateTimeline = () => {},
  isLoadingTip,
  setIsLoadingTip = () => {},
}) {
  const [showPopup, setShowPopup] = useState(false);
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  let tipList;

  if (loading) {
    tipList = (
      <TipperList>
        <LoadingDiv>
          <Loading size={16} />
        </LoadingDiv>
      </TipperList>
    );
  } else if (tips.length === 0) {
    tipList = (
      <TipperList>
        <NoTippers>No tippers</NoTippers>
      </TipperList>
    );
  } else {
    tipList = (
      <TipperList>
        {tips.map(([address, amount]) => (
          <TipperItem key={address}>
            <User chain={chain} add={address} fontSize={12} />
            <div>{`${toPrecision(amount ?? 0, decimals)} ${symbol}`}</div>
          </TipperItem>
        ))}
      </TipperList>
    );
  }

  let action;
  if (tipIsFinal) {
    action = <Description>This tip has been closed.</Description>;
  } else if (userIsTipper) {
    action = (
      <SecondaryButton isFill onClick={() => setShowPopup(true)}>
        Endorse
      </SecondaryButton>
    );
  } else {
    action = (
      <Description>
        Only council members can tip, no account found from the council.{" "}
        <span onClick={() => setShowPopup(true)}>Still tip</span>
      </Description>
    );
  }

  return (
    <>
      <Wrapper>
        <Content>
          <Title>
            <div>Tippers</div>
            <div>{isLoadingTip && <Loading size={16} />}</div>
          </Title>
          {tipList}
        </Content>
        {!loading && action}
      </Wrapper>
      {showPopup && (
        <Popup
          chain={chain}
          councilTippers={councilTippers}
          tipHash={tipHash}
          onClose={() => setShowPopup(false)}
          onInBlock={updateTips}
          onFinalized={updateTimeline}
          onSubmitted={() => setIsLoadingTip(true)}
        />
      )}
    </>
  );
}

import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";

import Button from "components/button";
import User from "components/user";
import { getNode, toPrecision } from "utils";
import LoadingIcon from "public/imgs/icons/members-loading.svg";

const Popup = dynamic(() => import("./popup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  width: 280px;
  margin-top: 0 !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1444px) {
    position: static;
    width: auto;
  }
`;

const Content = styled.div`
  padding: 24px;
  background: #ebeef4;
  border-radius: 6px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 100%;
  margin-bottom: 16px;
`;

const NoTippers = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 140%;
  color: #9da9bb;
`;

const Description = styled.div`
  font-size: 12px;
  line-height: 140%;
  color: #9da9bb;
  > span {
    color: #6848ff;
    cursor: pointer;
  }
`;

const TipperList = styled.div`
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
  color: #506176;
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
  updateTips = ()=>{},
  updateTimeline = ()=>{},
}) {
  const [showPopup, setShowPopup] = useState(false);

  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  let tipList = null;

  if (loading) {
    tipList = (
      <TipperList>
        <LoadingDiv>
          <LoadingIcon />
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
            <User chain={chain} add={address} />
            <div>{`${toPrecision(amount ?? 0, decimals)} ${symbol}`}</div>
          </TipperItem>
        ))}
      </TipperList>
    );
  }

  let action = null;

  if (tipIsFinal) {
    action = (
      <Description>
        This tip has been cloesd.
      </Description>
    );
  } else if (userIsTipper) {
    action = (
      <Button secondary isFill onClick={() => setShowPopup(true)}>
        Endorse
      </Button>
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
          <Title>Tippers</Title>
          {tipList}
        </Content>
        {!loading && action}
      </Wrapper>
      {showPopup &&
        <Popup
          chain={chain}
          councilTippers={councilTippers}
          tipHash={tipHash}
          onClose={(tipSent) => {
            if (tipSent) {
              updateTips();
            }
            setShowPopup(false);
          }}
          onFinalized={updateTimeline}
        />}
    </>
  );
}

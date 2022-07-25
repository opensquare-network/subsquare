import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";

import Button from "next-common/components/button";
import User from "next-common/components/user";
import Loading from "next-common/components/loading";
import PrimeAddressMark from "next-common/components/primeAddressMark";

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
  background: ${(props) => props.theme.neutral};
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
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
    color: #6848ff;
    cursor: pointer;
  }
`;

const TipperList = styled.div`
  padding: 8px 0;
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
    display: flex;
    align-items: center;
    > img {
      margin-left: 8px;
    }
  }
`;

const LoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VoterAddr = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function Vote({
  chain,
  motionIsFinal = false,
  userCanVote = false,
  loading = false,
  votes = [],
  voters = [],
  prime,
  motionHash,
  motionIndex,
  type,
  updateVotes = () => {},
  isLoadingVote = false,
  setIsLoadingVote = () => {},
}) {
  const [showPopup, setShowPopup] = useState(false);

  let voteList = null;

  if (loading) {
    voteList = (
      <TipperList>
        <LoadingDiv>
          <Loading size={16} />
        </LoadingDiv>
      </TipperList>
    );
  } else if (votes.length === 0) {
    voteList = (
      <TipperList>
        <NoTippers>No Vote</NoTippers>
      </TipperList>
    );
  } else {
    voteList = (
      <TipperList>
        {votes.map(([voter, approve], index) => (
          <TipperItem key={index}>
            <VoterAddr>
              <User add={voter} chain={chain} fontSize={12} />
              {voter === prime && <PrimeAddressMark />}
            </VoterAddr>
            {approve ? (
              <div>
                Aye
                <img src="/imgs/icons/aye.svg" alt="" />
              </div>
            ) : (
              <div>
                Nay
                <img src="/imgs/icons/nay.svg" alt="" />
              </div>
            )}
          </TipperItem>
        ))}
      </TipperList>
    );
  }

  let action;
  if (motionIsFinal) {
    action = <Description>This vote has been closed.</Description>;
  } else if (userCanVote) {
    action = (
      <Button secondary isFill onClick={() => setShowPopup(true)}>
        Vote
      </Button>
    );
  } else {
    action = (
      <Description>
        Only council members can vote, no account found from the council.{" "}
        <span onClick={() => setShowPopup(true)}>Still vote</span>
      </Description>
    );
  }

  return (
    <>
      <Wrapper>
        <Content>
          <Title>
            <div>Votes</div>
            <div>{isLoadingVote && <Loading size={16} />}</div>
          </Title>
          {voteList}
        </Content>
        {!loading && action}
      </Wrapper>
      {showPopup && (
        <Popup
          chain={chain}
          votes={votes}
          voters={voters}
          motionHash={motionHash}
          motionIndex={motionIndex}
          type={type}
          onClose={() => setShowPopup(false)}
          onInBlock={updateVotes}
          onSubmitted={() => setIsLoadingVote(true)}
        />
      )}
    </>
  );
}

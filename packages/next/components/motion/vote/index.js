import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";
import User from "next-common/components/user";
import Loading from "next-common/components/loading";
import PrimeAddressMark from "next-common/components/primeAddressMark";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import { GhostCard } from "next-common/components/styled/containers/ghostCard";
import Link from "next/link";

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

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  color: ${(props) => props.theme.textPrimary};
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

const Anchor = styled.a`
  display: block;
  margin-top: 20px !important;
  margin-bottom: -8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.primaryPurple500};
  cursor: pointer;
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
        <Link href="/council/members" passHref>
          <Anchor>Check all councilors</Anchor>
        </Link>
      </TipperList>
    );
  }

  let action;
  if (motionIsFinal) {
    action = <Description>This vote has been closed.</Description>;
  } else if (userCanVote) {
    action = (
      <SecondaryButton secondary isFill onClick={() => setShowPopup(true)}>
        Vote
      </SecondaryButton>
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
        <GhostCard>
          <Title>
            <div>Votes</div>
            <div>{isLoadingVote && <Loading size={16} />}</div>
          </Title>
          {voteList}
        </GhostCard>
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

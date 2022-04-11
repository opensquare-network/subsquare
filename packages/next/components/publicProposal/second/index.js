import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";

import Button from "next-common/components/button";
import User from "next-common/components/user";
import LoadingIcon from "public/imgs/icons/members-loading.svg";
import Loading from "components/loading";

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
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
`;

const Content = styled.div`
  padding: 24px;
  background: #ebeef4;
  border-radius: 6px;
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

const NoSeconds = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 140%;
  color: #9da9bb;
`;

const SecondsList = styled.div`
  padding: 8px 0px;
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const SecondItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  > :last-child {
    white-space: nowrap;
  }
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

const LoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListMore = styled.div`
  cursor: pointer;
  margin-top: 16px !important;
  font-weight: 500;
  font-size: 12px;
  color: #6848ff;
`;

export default function Second({
  chain,
  proposalIndex,
  seconds = [],
  depositRequired,
  hasTurnIntoReferendum,
  hasCanceled,
  loading = true,
  updateSeconds = () => {},
  updateTimeline = () => {},
  isLoadingSeconds,
  setIsLoadingSeconds = () => {},
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [expand, setExpand] = useState(false);

  const showFold = !expand && seconds.length > 5;
  const showData = showFold ? seconds.slice(0, 5) : seconds;

  let secondsList;

  if (loading) {
    secondsList = (
      <SecondsList>
        <LoadingDiv>
          <LoadingIcon />
        </LoadingDiv>
      </SecondsList>
    );
  } else if (seconds.length === 0) {
    secondsList = (
      <SecondsList>
        <NoSeconds>No current seconds</NoSeconds>
      </SecondsList>
    );
  } else {
    secondsList = (
      <SecondsList>
        {showData.map((address, index) => (
          <SecondItem key={index}>
            <User chain={chain} add={address} fontSize={12} />
          </SecondItem>
        ))}
        {showFold && (
          <ListMore onClick={() => setExpand(!expand)}>
            Show more results
          </ListMore>
        )}
      </SecondsList>
    );
  }

  let action;
  if (hasTurnIntoReferendum) {
    action = (
      <Description>This proposal has been turned into referendum.</Description>
    );
  } else if (hasCanceled) {
    action = <Description>This proposal has been canceled.</Description>;
  } else {
    action = (
      <Button secondary isFill onClick={() => setShowPopup(true)}>
        Second
      </Button>
    );
  }

  return (
    <>
      <Wrapper>
        <Content>
          <Title>
            <div>Second</div>
            <div>
              {isLoadingSeconds ? <Loading size={16} /> : seconds.length}
            </div>
          </Title>
          {secondsList}
        </Content>
        {!loading && action}
      </Wrapper>
      {showPopup && (
        <Popup
          chain={chain}
          proposalIndex={proposalIndex}
          depositorUpperBound={seconds.length}
          depositRequired={depositRequired}
          onClose={() => setShowPopup(false)}
          onInBlock={updateSeconds}
          onFinalized={updateTimeline}
          onSubmitted={() => setIsLoadingSeconds(true)}
        />
      )}
    </>
  );
}

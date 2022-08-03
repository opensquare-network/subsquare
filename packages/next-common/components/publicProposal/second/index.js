import React, { useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import countBy from "lodash.countby";
import BigNumber from "bignumber.js";
import User from "../../user";
import Loading from "../../loading";
import { emptyFunction } from "../../../utils";
import useDepositOf from "../../../utils/hooks/useDepositOf";
import useApi from "../../../utils/hooks/useSelectedEnpointApi";
import { getNode } from "next-common/utils";
import Tooltip from "../../tooltip";
import SecondaryButton from "../../buttons/secondaryButton";
import { GhostCard } from "../../styled/containers/ghostCard";
import { TitleContainer } from "../../styled/containers/titleContainer";

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

const Title = styled(TitleContainer)`
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
    font-size: 14px;
    font-weight: normal;
  }
`;

const NoSeconds = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 140%;
  color: ${(props) => props.theme.textTertiary};
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
  color: ${(props) => props.theme.textSecondary};
  > :last-child {
    white-space: nowrap;
  }
`;

const DepositRequired = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: ${(props) => props.theme.textSecondary};
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

const ListMore = styled.div`
  cursor: pointer;
  margin-top: 16px !important;
  font-weight: 500;
  font-size: 12px;
  color: ${(props) => props.theme.primaryPurple500}; ;
`;

export default function Second({
  chain,
  proposalIndex,
  hasTurnIntoReferendum,
  hasCanceled,
  useAddressVotingBalance,
  atBlockHeight,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [expand, setExpand] = useState(false);

  const api = useApi(chain);
  const [triggerUpdate, setTriggerUpdate] = useState(0);
  const [seconds, depositRequired, isLoadingSeconds] = useDepositOf(
    api,
    proposalIndex,
    atBlockHeight,
    triggerUpdate
  );
  const node = getNode(chain);
  const secondsCount = countBy(seconds);
  const secondsAddress = Object.keys(secondsCount);

  const showFold = !expand && secondsAddress.length > 5;
  const showData = showFold ? secondsAddress.slice(0, 5) : secondsAddress;

  let secondsList;

  if (seconds.length === 0) {
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
            <User chain={chain} add={address} fontSize={12} maxWidth={104} />
            <Tooltip
              content={`${new BigNumber(depositRequired)
                .times(secondsCount[address])
                .div(Math.pow(10, node.decimals))} ${
                node?.voteSymbol ?? node?.symbol
              }`}
            >
              <DepositRequired>{`x${secondsCount[address]}`}</DepositRequired>
            </Tooltip>
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
      <SecondaryButton isFill onClick={() => setShowPopup(true)}>
        Second
      </SecondaryButton>
    );
  }

  const totalSeconds = isLoadingSeconds ? (
    <Loading size={16} />
  ) : (
    <Tooltip
      content={`${new BigNumber(depositRequired)
        .times(seconds.length)
        .div(Math.pow(10, node.decimals))} ${node?.voteSymbol ?? node?.symbol}`}
    >
      {seconds.length}
    </Tooltip>
  );

  return (
    <>
      <Wrapper>
        <GhostCard>
          <Title>
            <div>Second</div>
            <div>{totalSeconds}</div>
          </Title>
          {secondsList}
        </GhostCard>
        {action}
      </Wrapper>
      {showPopup && (
        <Popup
          chain={chain}
          proposalIndex={proposalIndex}
          depositorUpperBound={seconds.length}
          depositRequired={depositRequired}
          onClose={() => setShowPopup(false)}
          onInBlock={() => setTriggerUpdate(Date.now())}
          onFinalized={emptyFunction}
          onSubmitted={emptyFunction}
          useAddressVotingBalance={useAddressVotingBalance}
        />
      )}
    </>
  );
}

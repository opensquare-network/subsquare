import React, { Fragment, useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import countBy from "lodash.countby";
import BigNumber from "bignumber.js";
import User from "../../user";
import Loading from "../../loading";
import { emptyFunction } from "../../../utils";
import useDepositOf from "../../../utils/hooks/useDepositOf";
import useApi from "../../../utils/hooks/useApi";
import Tooltip from "../../tooltip";
import SecondaryButton from "../../buttons/secondaryButton";
import { GhostCard } from "../../styled/containers/ghostCard";
import { TitleContainer } from "../../styled/containers/titleContainer";
import SubLink from "../../styled/subLink";
import { useChainSettings } from "../../../context/chain";
import useMaxDeposits from "./useMaxDeposits";
import isMoonChain from "next-common/utils/isMoonChain";

const SecondPopup = dynamic(() => import("./popup"), {
  ssr: false,
});

const MoonSecondPopup = dynamic(() => import("./popup/moonPopup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
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
  padding: 2px 0px;
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

const ListMore = styled(SubLink)`
  margin-top: 16px !important;
`;

export default function Second({
  proposalIndex,
  hasTurnIntoReferendum,
  hasCanceled,
  useAddressVotingBalance,
  atBlockHeight,
  onFinalized = emptyFunction,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [expand, setExpand] = useState(false);
  const maxDeposits = useMaxDeposits();

  let Popup = SecondPopup;
  if (isMoonChain()) {
    Popup = MoonSecondPopup;
  }

  const api = useApi();
  const [triggerUpdate, setTriggerUpdate] = useState(0);
  const [seconds, depositRequired, isLoadingSeconds] = useDepositOf(
    api,
    proposalIndex,
    atBlockHeight,
    triggerUpdate,
  );
  const reachedMaxDeposits = maxDeposits <= seconds.length;

  const node = useChainSettings();
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
      <Fragment>
        <SecondsList>
          {showData.map((address, index) => (
            <SecondItem key={index}>
              <User add={address} fontSize={12} maxWidth={148} />
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
        </SecondsList>

        {showFold && (
          <ListMore onClick={() => setExpand(!expand)}>
            Show more results
          </ListMore>
        )}
      </Fragment>
    );
  }

  let action;
  if (hasTurnIntoReferendum) {
    action = (
      <Description>This proposal has been turned into referendum.</Description>
    );
  } else if (reachedMaxDeposits) {
    action = <Description>Has reached max deposits.</Description>;
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
        {!node?.hideActionButtons && action}
      </Wrapper>
      {showPopup && (
        <Popup
          proposalIndex={proposalIndex}
          depositorUpperBound={seconds.length}
          depositRequired={depositRequired}
          onClose={() => setShowPopup(false)}
          onInBlock={() => setTriggerUpdate(Date.now())}
          onFinalized={onFinalized}
          onSubmitted={emptyFunction}
          useAddressVotingBalance={useAddressVotingBalance}
        />
      )}
    </>
  );
}

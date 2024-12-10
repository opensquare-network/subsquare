import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { countBy } from "lodash-es";
import BigNumber from "bignumber.js";
import Loading from "../../loading";
import useDepositOf from "../../../utils/hooks/useDepositOf";
import Tooltip from "../../tooltip";
import PrimaryButton from "next-common/lib/button/primary";
import { TitleContainer } from "../../styled/containers/titleContainer";
import SubLink from "../../styled/subLink";
import { useChainSettings } from "../../../context/chain";
import useMaxDeposits from "./useMaxDeposits";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import AddressUser from "next-common/components/user/addressUser";
import { useContextApi } from "next-common/context/api";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SecondPopup = dynamicPopup(() => import("./popup"));

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
  color: var(--textTertiary);
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
  color: var(--textSecondary);
  > :last-child {
    white-space: nowrap;
  }
`;

const DepositRequired = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: var(--textSecondary);
`;

const Description = styled.div`
  font-size: 12px;
  line-height: 140%;
  color: var(--textTertiary);
  > span {
    color: var(--theme500);
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
  atBlockHeight,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [expand, setExpand] = useState(false);
  const maxDeposits = useMaxDeposits();

  const api = useContextApi();
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
              <AddressUser add={address} fontSize={12} maxWidth={148} />
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
      <PrimaryButton className="w-full" onClick={() => setShowPopup(true)}>
        Second
      </PrimaryButton>
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
      <RightBarWrapper>
        <SecondaryCardDetail>
          <Title className="!px-0">
            <div>Second</div>
            <div>{totalSeconds}</div>
          </Title>
          {secondsList}
        </SecondaryCardDetail>
        {!node?.hideActionButtons && action}
      </RightBarWrapper>
      {showPopup && (
        <SecondPopup
          proposalIndex={proposalIndex}
          depositorUpperBound={seconds.length}
          depositRequired={depositRequired}
          onClose={() => setShowPopup(false)}
          onInBlock={() => setTriggerUpdate(Date.now())}
        />
      )}
    </>
  );
}

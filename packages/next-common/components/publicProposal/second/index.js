import { useState } from "react";
import styled from "styled-components";
import { countBy, isNil } from "lodash-es";
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
import dynamicPopup from "next-common/lib/dynamic/popup";
import { usePost } from "next-common/context/post";

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

export default function Second() {
  const post = usePost();
  const publicProposal = post?.onchainData;
  const proposalIndex = publicProposal?.proposalIndex;
  const hasTurnIntoReferendum = !isNil(publicProposal.referendumIndex);
  const state = publicProposal?.state?.state;
  const hasCanceled = ["Canceled", "Cleared", "Removed"].includes(state);

  if (hasTurnIntoReferendum || hasCanceled) {
    return (
      <SecondOfEndedProposal
        proposalIndex={proposalIndex}
        hasTurnIntoReferendum={hasTurnIntoReferendum}
      />
    );
  }

  return <SecondOfOngoingProposal proposalIndex={proposalIndex} />;
}

function TotalSeconds({ seconds, depositRequired, isLoadingSeconds }) {
  const node = useChainSettings();
  if (isLoadingSeconds) {
    return <Loading size={16} />;
  }

  return (
    <Tooltip
      content={`${new BigNumber(depositRequired)
        .times(seconds.length)
        .div(Math.pow(10, node.decimals))} ${node?.voteSymbol ?? node?.symbol}`}
    >
      {seconds.length}
    </Tooltip>
  );
}

function SecondList({ seconds, depositRequired }) {
  const [expand, setExpand] = useState(false);
  const node = useChainSettings();

  const secondsCount = countBy(seconds);
  const secondsAddress = Object.keys(secondsCount);

  const showFold = !expand && secondsAddress.length > 5;
  const showData = showFold ? secondsAddress.slice(0, 5) : secondsAddress;

  if (seconds.length === 0) {
    return (
      <SecondsList>
        <NoSeconds>No current seconds</NoSeconds>
      </SecondsList>
    );
  }

  return (
    <>
      <SecondsList>
        {showData.map((address, index) => (
          <SecondItem key={index}>
            <AddressUser
              add={address}
              className="text12Medium text-textPrimary"
              maxWidth={148}
            />
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
    </>
  );
}

function SecondListCard({ seconds, depositRequired, isLoadingSeconds }) {
  return (
    <SecondaryCardDetail>
      <Title className="!px-0">
        <div>Second</div>
        <div>
          <TotalSeconds
            seconds={seconds}
            depositRequired={depositRequired}
            isLoadingSeconds={isLoadingSeconds}
          />
        </div>
      </Title>
      <SecondList seconds={seconds} depositRequired={depositRequired} />
    </SecondaryCardDetail>
  );
}

function SecondOfEndedProposal({ proposalIndex, hasTurnIntoReferendum }) {
  //TODO: load deposit data from server side for ended proposal
  const [seconds, depositRequired, isLoadingSeconds] =
    useDepositOf(proposalIndex);
  const node = useChainSettings();

  return (
    <RightBarWrapper>
      <SecondListCard
        seconds={seconds}
        depositRequired={depositRequired}
        isLoadingSeconds={isLoadingSeconds}
      />
      {!node?.hideActionButtons &&
        (hasTurnIntoReferendum ? (
          <Description>
            This proposal has been turned into referendum.
          </Description>
        ) : (
          <Description>This proposal has been canceled.</Description>
        ))}
    </RightBarWrapper>
  );
}

function SecondOfOngoingProposal({ proposalIndex }) {
  const [triggerUpdate, setTriggerUpdate] = useState(0);
  const [seconds, depositRequired, isLoadingSeconds] = useDepositOf(
    proposalIndex,
    triggerUpdate,
  );

  const node = useChainSettings();

  return (
    <RightBarWrapper>
      <SecondListCard
        seconds={seconds}
        depositRequired={depositRequired}
        isLoadingSeconds={isLoadingSeconds}
      />
      {!node?.hideActionButtons && (
        <SecondButton
          proposalIndex={proposalIndex}
          depositRequired={depositRequired}
          seconds={seconds}
          setTriggerUpdate={setTriggerUpdate}
        />
      )}
    </RightBarWrapper>
  );
}

function SecondButton({
  proposalIndex,
  depositRequired,
  seconds,
  setTriggerUpdate,
}) {
  const [showPopup, setShowPopup] = useState(false);

  const maxDeposits = useMaxDeposits();
  const reachedMaxDeposits = maxDeposits <= seconds.length;
  if (reachedMaxDeposits) {
    return <Description>Has reached max deposits.</Description>;
  }
  return (
    <>
      <PrimaryButton className="w-full" onClick={() => setShowPopup(true)}>
        Second
      </PrimaryButton>
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

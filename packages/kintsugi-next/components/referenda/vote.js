import { useState } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { toPrecision } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import {
  calcPassing,
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityAgainst,
  getThresholdOfSuperMajorityApprove,
} from "next-common/utils/referendumUtil";
import Threshold from "./threshold";
import Loading from "next-common/components/loading";
import PrimaryButton from "next-common/lib/button/primary";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useSelector } from "react-redux";
import {
  electorateSelector,
  isLoadingElectorateSelector,
  referendumStatusSelector,
} from "next-common/store/reducers/referendumSlice";
import { useChain, useChainSettings } from "next-common/context/chain";
import MyVote from "./myVote";
import TallyInfo from "next-common/components/referenda/tally/info";
import useLatestDemocracyTally from "next-common/hooks/democracy/tally";
import { capitalize } from "lodash-es";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import VotesInfo from "./votesInfo";
import ExternalLink from "next-common/components/externalLink";
import WithAddress from "next-common/components/common/withAddress";
import { VoteSuccessfulProvider } from "next-common/components/vote";
import VoteSuccessfulPopup from "./popup/voteSuccessful";
import dynamicPopup from "next-common/lib/dynamic/popup";

const Popup = dynamicPopup(() => import("./popup"));

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const Headers = styled(Flex)`
  justify-content: space-between;
  font-size: 12px;
  color: var(--textSecondary);

  span:nth-child(2) {
    text-align: center;
    white-space: nowrap;
  }

  span:nth-child(3) {
    text-align: right;
  }
`;

const Contents = styled(Headers)`
  font-weight: 500;
  color: var(--textPrimary);
  margin-top: 8px !important;
  margin-bottom: 16px;
`;

const Status = styled.div`
  width: 100%;
  line-height: 38px;
  border-width: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: default;
  text-align: center;
  margin-top: 8px;
`;

const PassStatus = styled(Status)`
  color: var(--green500);
  background: var(--green100);
`;

const RejectStatus = styled(Status)`
  color: var(--red500);
  background: var(--red100);
`;

const BarWrapper = styled.div`
  position: relative;
`;

const BarContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: ${(p) => p.gap}px;
  height: 8px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

const AyesBar = styled.div`
  background-color: var(--green500);
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const NaysBar = styled.div`
  background-color: var(--red500);
  width: ${(p) => p.precent}%;
  height: 100%;
`;

function Vote({ referendumInfo, referendumIndex }) {
  const chain = useChain();
  const [showVote, setShowVote] = useState(false);
  const tally = useLatestDemocracyTally();

  const electorate = useSelector(electorateSelector);
  const isElectorateLoading = useSelector(isLoadingElectorateSelector);
  const referendumStatus = useSelector(referendumStatusSelector);

  const node = useChainSettings(chain);
  const decimals = node.decimals;

  const isPassing = calcPassing(referendumStatus, electorate);

  const nAyes = toPrecision(tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(tally?.nays ?? 0, decimals);

  let nAyesPercent = 50;
  let nNaysPercent = 50;
  let gap = 2;
  const nTotal = new BigNumber(nAyes).plus(nNays);
  if (nTotal.gt(0)) {
    nAyesPercent = Math.round(
      new BigNumber(nAyes).div(nTotal).toNumber() * 100,
    );
    nNaysPercent = 100 - nAyesPercent;
    if (nAyesPercent === 100 || nNaysPercent === 100) {
      gap = 0;
    }
  }

  return (
    <RightBarWrapper>
      <SecondaryCardDetail>
        <Title className="!px-0">
          <span>Votes</span>
          <div>{isElectorateLoading ? <Loading size={16} /> : null}</div>
        </Title>

        <BarWrapper>
          <BarContainer gap={gap}>
            <AyesBar precent={nAyesPercent} />
            <NaysBar precent={nNaysPercent} />

            {(referendumStatus?.threshold || "").toLowerCase() ===
              "simplemajority" && (
              <Threshold threshold={getThresholdOfSimplyMajority()} />
            )}

            {(referendumStatus?.threshold || "").toLowerCase() ===
              "supermajorityapprove" && (
              <Threshold
                threshold={getThresholdOfSuperMajorityApprove(
                  tally?.turnout ?? 0,
                  electorate,
                )}
              />
            )}

            {(referendumStatus?.threshold || "").toLowerCase() ===
              "supermajorityagainst" && (
              <Threshold
                threshold={getThresholdOfSuperMajorityAgainst(
                  tally?.turnout ?? 0,
                  electorate,
                )}
              />
            )}
          </BarContainer>
        </BarWrapper>

        <Headers>
          <span>Aye</span>
          <span>Passing threshold</span>
          <span>Nay</span>
        </Headers>

        <Contents>
          <span style={{ width: 40 }}>{nAyesPercent}%</span>
          <span>{referendumStatus?.threshold}</span>
          <span style={{ width: 40 }}>{nNaysPercent}%</span>
        </Contents>

        <TallyInfo tally={tally} />

        {referendumInfo?.finished?.approved && <PassStatus>Passed</PassStatus>}
        {referendumInfo?.finished?.approved === false && (
          <RejectStatus>Failed</RejectStatus>
        )}
        {referendumInfo &&
          !referendumInfo.finished &&
          (isPassing ? (
            <PassStatus>Passing</PassStatus>
          ) : (
            <RejectStatus>Failing</RejectStatus>
          ))}

        <VotesInfo />
      </SecondaryCardDetail>

      <WithAddress>
        <MyVote />
      </WithAddress>

      {!referendumInfo?.finished && (
        <PrimaryButton
          className="w-full"
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </PrimaryButton>
      )}

      <ExternalLink href={`https://docs.interlay.io/#/${chain}/governance`}>
        How {capitalize(chain)} Governance Works.
      </ExternalLink>

      <VoteSuccessfulProvider VoteSuccessfulPopup={VoteSuccessfulPopup}>
        {showVote && (
          <Popup
            onClose={() => setShowVote(false)}
            referendumIndex={referendumIndex}
          />
        )}
      </VoteSuccessfulProvider>
    </RightBarWrapper>
  );
}

export default Vote;

// collective voted list
import { StatisticTitleContainer } from "next-common/components/styled/containers/titleContainer";
import Flex from "next-common/components/styled/flex";
import Statistics from "next-common/components/styled/paragraph/statistic";
import MemberLinks from "../memberLinks";
import { useOnchainData, usePostOnChainData } from "next-common/context/post";
import PrimeAddressMark from "next-common/components/primeAddressMark";
import AyeNay from "next-common/components/collective/AyeNay";
import styled from "styled-components";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import AddressUser from "next-common/components/user/addressUser";
import useCollectiveMotionVotes from "next-common/hooks/collective/useCollectiveVotes";
import { isMotionEnded } from "next-common/utils";
import usePrime from "next-common/utils/hooks/usePrime";

const TipperList = styled.div`
  margin-top: 16px;
  padding: 8px 0;
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const NoTippers = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 140%;
  color: var(--textTertiary);
`;

const TipperItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  line-height: 100%;
  color: var(--textSecondary);
`;

const VoterAddr = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function Voters() {
  const onchainData = useOnchainData();
  const motionEnd = isMotionEnded(onchainData);
  const blockHash = motionEnd ? onchainData?.state?.indexer?.blockHash : null;
  const prime = usePrime(blockHash);

  const votes = useCollectiveMotionVotes();
  const ayeVotesCount = votes.filter(([, approval]) => approval).length;

  let voteList;
  if (votes.length === 0) {
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
              <AddressUser add={voter} fontSize={12} />
              {voter === prime && <PrimeAddressMark />}
            </VoterAddr>
            <AyeNay isAye={approve} />
          </TipperItem>
        ))}
      </TipperList>
    );
  }

  return (
    <SecondaryCardDetail>
      <StatisticTitleContainer className="!px-0">
        <Flex>
          <span>Votes</span>
          <Statistics>
            {ayeVotesCount}/{onchainData?.threshold}
          </Statistics>
        </Flex>
      </StatisticTitleContainer>
      {voteList}
      <MemberLinks />
    </SecondaryCardDetail>
  );
}

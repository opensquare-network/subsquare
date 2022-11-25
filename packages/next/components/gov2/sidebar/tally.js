// bulk of copies from "components/referenda/tallyInfo"

import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Flex from "next-common/components/styled/flex";
import { toPrecision } from "next-common/utils";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import styled from "styled-components";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";
import TurnoutIcon from "public/imgs/icons/turnout.svg";
import DisplayValue from "next-common/components/displayValue";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import useFetchVoteExtrinsics from "next-common/utils/gov2/useFetchVoteExtrinsics";
import { useChainSettings } from "next-common/context/chain";
import { useState } from "react";
import AllVotesPopup from "next-common/components/democracy/allVotesPopup";
import AllVoteExtrinsicsPopup from "./allVoteExtrinsicsPopup";
import {
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";
import VotesCount from "next-common/components/democracy/referendum/votesCount";
import { useSelector } from "react-redux";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const Row = styled(Flex)`
  height: 44px;
  margin-top: 0 !important;
  justify-content: space-between;
  white-space: nowrap;
  font-size: 14px;
`;

const BorderedRow = styled(Row)`
  border-bottom: 1px solid ${(props) => props.theme.grey200Border};
`;

const Header = styled.span`
  width: 120px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.textPrimary};

  svg {
    margin-right: 8px;
  }
`;

const Value = styled.span`
  color: ${(props) => props.theme.textPrimary};
`;

const Footer = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: 16px;
  }
  margin-top: 16px;
`;

const Button = styled.div`
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #6848ff;
`;

export default function Gov2Tally({ detail }) {
  const [showAllVotes, setShowAllVotes] = useState(false);
  const [showVoteExtrinsic, setShowVoteExtrinsic] = useState(false);
  const { width } = useWindowSize();
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);

  useFetchVotes(detail?.onchainData);
  useFetchVoteExtrinsics(detail?.onchainData);

  const node = useChainSettings();
  const decimals = node.decimals;
  const symbol = node.voteSymbol ?? node.symbol;

  const tally = detail?.onchainData?.info?.tally;

  const nAyes = toPrecision(tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(tally?.nays ?? 0, decimals);
  const nSupport = toPrecision(tally?.support ?? 0, decimals);

  if (!node) {
    return null;
  }

  return (
    <div>
      <SecondaryCardDetail>
        <Title>Tally</Title>
        <div>
          <BorderedRow>
            <Header>
              <AyeIcon />
              Aye
              {!isLoadingVotes ? (
                <VotesCount>{allAye.length}</VotesCount>
              ) : null}
            </Header>
            <Value>
              <DisplayValue
                value={nAyes}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </BorderedRow>
          <BorderedRow>
            <Header>
              <NayIcon />
              Nay
              {!isLoadingVotes ? (
                <VotesCount>{allNay.length}</VotesCount>
              ) : null}
            </Header>
            <Value>
              <DisplayValue
                value={nNays}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </BorderedRow>
          <Row>
            <Header>
              <TurnoutIcon />
              Support
            </Header>
            <Value>
              <DisplayValue
                value={nSupport}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </Row>
        </div>
        <Footer>
          <Button onClick={() => setShowAllVotes(true)}>All Votes</Button>
          <Button onClick={() => setShowVoteExtrinsic(true)}>
            Vote Extrinsics
          </Button>
        </Footer>
      </SecondaryCardDetail>
      {showAllVotes && (
        <AllVotesPopup
          setShowVoteList={setShowAllVotes}
          allAye={allAye}
          allNay={allNay}
          isLoadingVotes={isLoadingVotes}
        />
      )}
      {showVoteExtrinsic && (
        <AllVoteExtrinsicsPopup setShowVoteList={setShowVoteExtrinsic} />
      )}
    </div>
  );
}

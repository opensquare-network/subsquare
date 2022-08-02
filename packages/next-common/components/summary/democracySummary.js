import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CountDown from "next-common/components/summary/countDown";
import useApi from "../../utils/hooks/useApi";
import { estimateBlocksTime } from "../../utils";
import { useSelector } from "react-redux";
import { currentNodeSelector } from "next-common/store/reducers/nodeSlice";
import {
  blockTimeSelector,
  finalizedHeightSelector,
} from "../../store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import { SecondaryCard } from "../styled/containers/secondaryCard";

const Wrapper = styled.div`
  display: flex;

  > :not(:first-child) {
    margin-left: 16px;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    > :not(:first-child) {
      margin-left: 0;
      margin-top: 16px;
    }
  }
`;

const Card = styled(SecondaryCard)`
  position: relative;
  color: ${(props) => props.theme.textPrimary};
  flex: 0 1 33.33%;
  height: 88px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const Content = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  color: ${(props) => props.theme.textPrimary};

  > .unit {
    color: ${(props) => props.theme.textTertiary};
  }

  > .upper {
    text-transform: uppercase;
  }

  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const CountDownWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 24px;
  margin-top: 0 !important;
`;

const GreyText = styled.span`
  color: ${(props) => props.theme.textTertiary}; !important;
`;

async function referendumsActive(api) {
  if (!api) {
    return [];
  }
  const ids = await api.derive.democracy.referendumIds();
  const referendumInfos = await api.query.democracy.referendumInfoOf.multi(ids);
  return (referendumInfos || []).filter((referendumInfo) => {
    const info = referendumInfo.toJSON();
    return info?.ongoing;
  });
}

export default function DemocracySummary({ chain }) {
  const [summary, setSummary] = useState({});
  const endpoint = useSelector(currentNodeSelector);
  const api = useApi(chain, endpoint);
  const blockTime = useSelector(blockTimeSelector);
  const finalizedHeight = useSelector(finalizedHeightSelector);

  const getLaunchPeriod = async function () {
    if (api && finalizedHeight) {
      const launchPeriod = api.consts.democracy.launchPeriod.toNumber();
      const goneBlocks = new BigNumber(finalizedHeight)
        .mod(launchPeriod)
        .toNumber();
      const progress = new BigNumber(goneBlocks)
        .div(launchPeriod)
        .multipliedBy(100)
        .toNumber();
      const TimeArray = estimateBlocksTime(
        launchPeriod - goneBlocks,
        blockTime
      );
      return { progress, launchPeriod: TimeArray };
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }
    Promise.all([
      api.query.democracy.publicProps(),
      referendumsActive(api),
      api?.query.democracy.publicPropCount(),
      api?.query.democracy.referendumCount(),
      getLaunchPeriod(),
    ]).then(
      ([
        activeProposals,
        activeReferendums,
        publicPropCountResponse,
        referendumCountResponse,
        period,
      ]) => {
        setSummary({
          ...summary,
          activeProposalsCount: activeProposals?.length,
          referendumCount: (activeReferendums || []).length,
          publicPropCount: publicPropCountResponse.toJSON(),
          referendumTotal: referendumCountResponse.toJSON(),
          ...period,
        });
      }
    );
  }, [chain, api, blockTime, finalizedHeight]);

  return (
    <Wrapper>
      <Card>
        <Title>Proposals</Title>
        <Content>
          <span>
            {summary.activeProposalsCount || 0}
            <GreyText> / {summary.publicPropCount || 0}</GreyText>
          </span>
        </Content>
      </Card>
      <Card>
        <Title>Referenda</Title>
        <Content>
          <span>
            {summary.referendumCount || 0}
            <GreyText> / {summary.referendumTotal || 0}</GreyText>
          </span>
        </Content>
      </Card>
      <Card>
        <Title>Launch period</Title>
        <Content>
          {(summary?.launchPeriod || []).map((item, index) => (
            <span className={index % 2 === 1 ? "unit" : ""} key={index}>
              {item}
            </span>
          ))}
        </Content>
        <CountDownWrapper>
          <CountDown percent={summary?.progress ?? 0} />
        </CountDownWrapper>
      </Card>
    </Wrapper>
  );
}

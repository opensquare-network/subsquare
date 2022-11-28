import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import CountDown from "next-common/components/summary/countDown";
import useApi from "../../utils/hooks/useApi";
import { estimateBlocksTime } from "../../utils";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "../../store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import Content from "./cardContent";
import { useChain } from "../../context/chain";
import {
  SummaryCard,
  SummaryGreyText,
  SummaryTitle,
} from "next-common/components/summary/styled";
import { p_14_normal, p_20_bold } from "next-common/styles/componentCss";
import { smcss } from "next-common/utils/responsive";
import Divider from "next-common/components/styled/layout/divider";
import FlexBetween from "../styled/flexBetween";
import DemocracySummaryDelegation from "./democracySummaryDelegation";

const Wrapper = styled(SummaryCard)`
  height: auto;
`;

const TitleGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  color: ${(p) => p.theme.textPrimary};
  ${p_20_bold}
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  color: ${(p) => p.theme.textTertiary};
  ${p_14_normal};
`;

const SummaryWrapper = styled.div`
  display: flex;
  ${smcss(css`
    flex-direction: column;
    gap: 16px;
  `)}
`;

const SummaryItem = styled.div`
  flex: 1;
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

export default function DemocracySummary() {
  const chain = useChain();
  const [summary, setSummary] = useState({});
  const api = useApi();
  const blockTime = useSelector(blockTimeSelector);
  const blockHeight = useSelector(latestHeightSelector);

  const getLaunchPeriod = async function () {
    if (api && blockHeight) {
      const launchPeriod = api.consts.democracy.launchPeriod.toNumber();
      const goneBlocks = new BigNumber(blockHeight)
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
      return {
        progress,
        launchPeriod: TimeArray,
        totalPeriod: ["/"].concat(estimateBlocksTime(launchPeriod, blockTime)),
      };
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
  }, [chain, api, blockTime, blockHeight]);

  return (
    <Wrapper>
      <div>
        <TitleGroup>
          <Title>Referenda</Title>
        </TitleGroup>
        <Description>
          Referenda are simple, inclusive, stake-based voting schemes.
        </Description>
      </div>

      <Divider margin={16} />

      <SummaryWrapper>
        <SummaryItem>
          <SummaryTitle>Proposals</SummaryTitle>
          <Content>
            <span>
              {summary.activeProposalsCount || 0}
              <SummaryGreyText>
                {" "}
                / {summary.publicPropCount || 0}
              </SummaryGreyText>
            </span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryTitle>Referenda</SummaryTitle>
          <Content>
            <span>
              {summary.referendumCount || 0}
              <SummaryGreyText>
                {" "}
                / {summary.referendumTotal || 0}
              </SummaryGreyText>
            </span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <FlexBetween>
            <div>
              <SummaryTitle>Launch Period</SummaryTitle>
              <Content>
                {(summary?.launchPeriod || []).map((item, index) => (
                  <span className={index % 2 === 1 ? "unit" : ""} key={index}>
                    {item}
                  </span>
                ))}
                {(summary?.totalPeriod || []).map((item, index) => (
                  <span
                    className={index % 2 === 1 ? "unit total" : "total"}
                    key={index}
                  >
                    {item}
                  </span>
                ))}
              </Content>
            </div>

            <div>
              <CountDown percent={summary?.progress ?? 0} />
            </div>
          </FlexBetween>
        </SummaryItem>
      </SummaryWrapper>

      <Divider margin={16} />

      <DemocracySummaryDelegation />
    </Wrapper>
  );
}

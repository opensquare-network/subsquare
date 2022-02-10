import React, { useEffect } from "react";
import styled from "styled-components";
import { BN, BN_THOUSAND, BN_TWO, bnToBn, extractTime } from "@polkadot/util";
import { useDispatch, useSelector } from "react-redux";

import CountDown from "next-common/components/summary/countDown";
import { useApi } from "utils/hooks";
import {
  setSummary,
  summarySelector,
} from "next-common/store/reducers/democracySummarySlice";
// import { useBestNumber } from '@polkadot/react-hooks';

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

const Card = styled.div`
  position: relative;
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  flex: 0 1 33.33%;
  height: 88px;
  padding: 26px 24px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.16em;
  color: #9da9bb;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const Content = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  color: #1e2134;
  > .unit {
    color: #9da9bb;
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
`;

const GreyText = styled.span`
  color: #9da9bb !important;
`;

const DEFAULT_TIME = new BN(6_000);
const THRESHOLD = BN_THOUSAND.div(BN_TWO);
const EMPTY_U8A_32 = new Uint8Array(32);

export default function DemocracySummary({ chain }) {
  const dispatch = useDispatch();
  const api = useApi(chain);

  const summary = useSelector(summarySelector);

  useEffect(() => {
    if (!api) {
      return;
    }
    api.derive.democracy.proposals().then((activeProposals) => {
      dispatch(setSummary({ activeProposalsCount: activeProposals?.length }));
    });

    api.derive.democracy.referendums().then((referendums) => {
      dispatch(setSummary({ referendumCount: referendums?.length }));
    });

    api?.query.democracy.publicPropCount().then((response) => {
      const publicPropCount = response.toJSON();
      dispatch(setSummary({ publicPropCount }));
    });
    api?.query.democracy.referendumCount().then((response) => {
      const referendumCount = response.toJSON();
      dispatch(setSummary({ referendumTotal: referendumCount }));
    });
  }, [api, chain, dispatch]);

  useEffect(() => {
    const estimateBlocksTime = async (blocks) => {
      if (api) {
        const blockTime =
          // Babe
          api.consts.babe?.expectedBlockTime ||
          // POW, eg. Kulupu
          api.consts.difficulty?.targetBlockTime ||
          // Subspace
          api.consts.subspace?.expectedBlockTime ||
          // Check against threshold to determine value validity
          (api.consts.timestamp?.minimumPeriod.gte(THRESHOLD)
            ? // Default minimum period config
              api.consts.timestamp.minimumPeriod.mul(BN_TWO)
            : api.query.parachainSystem
            ? // default guess for a parachain
              DEFAULT_TIME.mul(BN_TWO)
            : // default guess for others
              DEFAULT_TIME);
        const value = blockTime.mul(bnToBn(blocks)).toNumber();
        const time = extractTime(Math.abs(value));
        const { days, hours, minutes, seconds } = time;
        return [
          days ? (days > 1 ? `${days} days` : "1 day") : null,
          hours ? (hours > 1 ? `${hours} hrs` : "1 hr") : null,
          minutes ? (minutes > 1 ? `${minutes} mins` : "1 min") : null,
          seconds ? (seconds > 1 ? `${seconds} s` : "1 s") : null,
        ]
          .filter((s) => !!s)
          .slice(0, 2)
          .join(" ")
          .split(" ");
      }
    };

    const getSpendPeriod = async function () {
      if (api) {
        const bestNumber = await api.derive.chain.bestNumber();
        const spendPeriod = api.consts.democracy.launchPeriod;
        const goneBlocks = bestNumber.mod(spendPeriod);
        const progress = goneBlocks.muln(100).div(spendPeriod).toNumber();
        const TimeArray = await estimateBlocksTime(
          spendPeriod.sub(goneBlocks).toNumber()
        );
        dispatch(setSummary({ progress, spendPeriod: TimeArray }));
      }
    };
    getSpendPeriod();
  }, [api, chain, dispatch]);

  return (
    <Wrapper>
      <Card>
        <Title>Proposals</Title>
        <Content>
          <span>
            {" "}
            {summary.activeProposalsCount}{" "}
            <GreyText> / {summary.publicPropCount}</GreyText>
          </span>
        </Content>
      </Card>
      <Card>
        <Title>Referenda</Title>
        <Content>
          <span>
            {summary.referendumCount}{" "}
            <GreyText> / {summary.referendumTotal}</GreyText>
          </span>
        </Content>
      </Card>
      <Card>
        <Title>Launch period</Title>
        <Content>
          {(summary?.spendPeriod || []).map((item, index) => (
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

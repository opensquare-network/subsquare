import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import CountDown from "next-common/components/summary/countDown";
import { useApi, useBlockTime, useBestNumber } from "utils/hooks";
import {
  setSummary,
  summarySelector,
} from "next-common/store/reducers/democracySummarySlice";
import { bnToBn, extractTime } from "@polkadot/util";
import { estimateBlocksTime } from "utils";

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

export default function DemocracySummary({ chain }) {
  const dispatch = useDispatch();
  const summary = useSelector(summarySelector);
  const api = useApi(chain);
  const blockTime = useBlockTime(api);
  const bestNumber = useBestNumber(api);

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
    const getLaunchPeriod = async function () {
      if (api && bestNumber) {
        const launchPeriod = api.consts.democracy.launchPeriod;
        const goneBlocks = bestNumber.mod(launchPeriod);
        const progress = goneBlocks.muln(100).div(launchPeriod).toNumber();
        const TimeArray = estimateBlocksTime(
          api,
          launchPeriod.sub(goneBlocks).toNumber(),
          blockTime
        );
        dispatch(setSummary({ progress, launchPeriod: TimeArray }));
      }
    };
    getLaunchPeriod();
  }, [api, blockTime, chain, dispatch]);

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

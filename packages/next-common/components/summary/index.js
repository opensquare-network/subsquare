import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import CountDown from "./countDown";
import { useBestNumber, useBlockTime } from "../../utils/hooks";
import {
  abbreviateBigNumber,
  estimateBlocksTime,
  getNode,
  toPrecision,
} from "../../utils";
import { currentNodeSelector } from "@subsquare/next/store/reducers/nodeSlice";
import useApi from "../../utils/hooks/useApi";
import useTreasuryFree from "../../utils/hooks/useTreasuryFree";
import useTreasuryBurn from "../../utils/hooks/useTreasuryBurn";

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

export default function Summary({ chain }) {
  const [summary, setSummary] = useState({});
  const dispatch = useDispatch();
  const endpoint = useSelector(currentNodeSelector);
  const api = useApi(chain, endpoint);
  const node = getNode(chain);
  const blockTime = useBlockTime(api);
  const bestNumber = useBestNumber(api);

  const decimals = node?.decimals;
  const symbol = node?.symbol;

  const free = useTreasuryFree(api, chain);
  const nextBurn = useTreasuryBurn(api, free);

  useEffect(() => {
    const getSpendPeriod = async function () {
      if (api && bestNumber) {
        const spendPeriod = api.consts.treasury.spendPeriod;
        const goneBlocks = bestNumber.mod(spendPeriod);
        const progress = goneBlocks.muln(100).div(spendPeriod).toNumber();
        const TimeArray = estimateBlocksTime(
          api,
          spendPeriod.sub(goneBlocks).toNumber(),
          blockTime
        );
        setSummary({ progress, spendPeriod: TimeArray });
      }
    };
    getSpendPeriod();
  }, [api, chain, dispatch, bestNumber]);

  return (
    <Wrapper>
      <Card>
        <Title>AVAILABLE</Title>
        <Content>
          <span>{abbreviateBigNumber(toPrecision(free, decimals))}</span>
          <span className="unit upper">{symbol}</span>
        </Content>
      </Card>
      <Card>
        <Title>NEXT BURN</Title>
        <Content>
          <span>{abbreviateBigNumber(toPrecision(nextBurn, decimals))}</span>
          <span className="unit upper">{symbol}</span>
        </Content>
      </Card>
      <Card>
        <Title>SPEND PERIOD</Title>
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

import { useEffect, useState } from "react";
import styled from "styled-components";

import CountDown from "./countDown";
import { toPrecision } from "utils/index";
import { TreasuryAccount } from "utils/constants";
import { useApi } from "utils/hooks";
import { getNode } from "utils";

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
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  flex-grow: 1;
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
  const api = useApi(chain);
  const node = getNode(chain);
  const decimals = node.decimals;
  const symbol = node.symbol;
  const [available, setAvailable] = useState(0);
  const [nextBurn, setNextBurn] = useState(0);
  const [spendPeriod, setSpendPeriod] = useState();

  useEffect(() => {
    api?.query.system.account(TreasuryAccount).then((response) => {
      const account = response.toJSON();
      const free = account ? toPrecision(account.data.free, decimals) : 0;
      const burnPercent = toPrecision(api.consts.treasury.burn, decimals) ?? 0;
      setAvailable(Number(free).toFixed(2));
      setNextBurn(Number(free * burnPercent).toFixed(2));
    });
  }, [api, chain, decimals]);

  useEffect(() => {
    const estimateBlocksTime = async (blocks) => {
      const nsPerBlock = api.consts.babe?.expectedBlockTime.toNumber();
      return nsPerBlock * blocks;
    };

    const getSpendPeriod = async function () {
      if (api) {
        const bestNumber = await api.derive.chain.bestNumber();
        const spendPeriod = api.consts.treasury.spendPeriod;
        const goneBlocks = bestNumber.mod(spendPeriod);
        setSpendPeriod({
          blockNumber: spendPeriod.toNumber(),
          periodTime: await estimateBlocksTime(spendPeriod),
          restBlocks: spendPeriod.sub(goneBlocks).toNumber(),
          restTime: await estimateBlocksTime(spendPeriod.sub(goneBlocks)),
          progress: goneBlocks.muln(100).div(spendPeriod).toNumber(),
        });
      }
    };
    getSpendPeriod();
  }, [api, chain]);

  return (
    <Wrapper>
      <Card>
        <Title>AVAILABLE</Title>
        <Content>
          <span>{available}</span>
          <span className="unit">{symbol}</span>
        </Content>
      </Card>
      <Card>
        <Title>NEXT BURN</Title>
        <Content>
          <span>{nextBurn}</span>
          <span className="unit">{symbol}</span>
        </Content>
      </Card>
      <Card>
        <Title>SPEND PERIOD</Title>
        <Content>
          <span>24</span>
          <span className="unit">days</span>
          <span>24</span>
          <span className="unit">hrs</span>
        </Content>
        <CountDownWrapper>
          <CountDown percent={spendPeriod?.progress} />
        </CountDownWrapper>
      </Card>
    </Wrapper>
  );
}

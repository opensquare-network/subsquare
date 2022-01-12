import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BN,
  BN_THOUSAND,
  BN_TWO,
  bnToBn,
  extractTime,
  u8aConcat,
} from "@polkadot/util";
import { useDispatch, useSelector } from "react-redux";

import CountDown from "./countDown";
import { toPrecision } from "utils/index";
import { useApi } from "utils/hooks";
import { getNode, abbreviateBigNumber } from "utils";
import { summarySelector, setSummary } from "store/reducers/summarySlice";

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

const DEFAULT_TIME = new BN(6_000);
const THRESHOLD = BN_THOUSAND.div(BN_TWO);
const EMPTY_U8A_32 = new Uint8Array(32);

export default function Summary({ chain }) {
  const dispatch = useDispatch();
  const api = useApi(chain);
  const node = getNode(chain);
  const decimals = node?.decimals;
  const symbol = node?.symbol;

  const summary = useSelector(summarySelector);

  useEffect(() => {
    const TreasuryAccount = u8aConcat(
      "modl",
      api?.consts.treasury && api.consts.treasury.palletId
        ? api.consts.treasury.palletId.toU8a(true)
        : "py/trsry",
      EMPTY_U8A_32
    ).subarray(0, 32);
    api?.query.system.account(TreasuryAccount).then((response) => {
      const account = response.toJSON();
      const free = account ? toPrecision(account.data.free, decimals) : 0;
      const burnPercent = toPrecision(api.consts.treasury.burn, decimals) ?? 0;
      const available = Number(free);
      const nextBurn = Number(free) * Number(burnPercent);
      dispatch(setSummary({ available, nextBurn }));
    });
  }, [api, chain, decimals, dispatch]);

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
        const timeArray = [
          days ? (days > 1 ? `${days} days` : "1 day") : null,
          hours ? (hours > 1 ? `${hours} hrs` : "1 hr") : null,
          minutes ? (minutes > 1 ? `${minutes} mins` : "1 min") : null,
          seconds ? (seconds > 1 ? `${seconds} s` : "1 s") : null,
        ]
          .filter((s) => !!s)
          .slice(0, 2)
          .join(" ")
          .split(" ");
        return timeArray;
      }
    };

    const getSpendPeriod = async function () {
      if (api) {
        const bestNumber = await api.derive.chain.bestNumber();
        const spendPeriod = api.consts.treasury.spendPeriod;
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
        <Title>AVAILABLE</Title>
        <Content>
          <span>{abbreviateBigNumber(summary?.available ?? 0)}</span>
          <span className="unit upper">{symbol}</span>
        </Content>
      </Card>
      <Card>
        <Title>NEXT BURN</Title>
        <Content>
          <span>{abbreviateBigNumber(summary?.nextBurn ?? 0)}</span>
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

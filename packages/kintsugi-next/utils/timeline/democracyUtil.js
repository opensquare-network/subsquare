import styled from "styled-components";
import dayjs from "dayjs";
import { getTimelineStatus } from "utils";
import { getNode, toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import { detailPageCategory } from "next-common/utils/consts/business/category";

const DepositorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  > :not(:first-child) {
    margin-top: 4px;
  }
`;

function getTimelineData(args, method, chain) {
  const { decimals, symbol, voteSymbol } = getNode(chain);
  switch (method) {
    case "Proposed":
      return {
        Index: `#${args.index}`,
      };
    case "Tabled":
      return {
        "Referenda Index": `#${args.referendumIndex}`,
        Deposit: `${toPrecision(args.deposit ?? 0, decimals)} ${
          voteSymbol || symbol
        }`,
        Depositors: (
          <DepositorsWrapper>
            {(args.depositors || []).map((item, index) => (
              <User add={item} key={index} chain={chain} />
            ))}
          </DepositorsWrapper>
        ),
      };
    case "Executed":
      const rawResult = args.result;
      let result;
      if (typeof rawResult === "boolean") {
        result = rawResult;
      } else if (typeof args.result === "object") {
        result = Object.keys(rawResult)[0];
      } else {
        result = JSON.stringify(rawResult);
      }

      return { result };
  }
  return args;
}

export function getDemocracyTimelineData(
  timeline,
  chain,
  type = detailPageCategory.DEMOCRACY_PROPOSAL
) {
  return timeline.map((item) => ({
    time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
    indexer: item.indexer,
    status: getTimelineStatus(type, item.method ?? item.name),
    data: getTimelineData(item.args, item.method ?? item.name, chain),
  }));
}

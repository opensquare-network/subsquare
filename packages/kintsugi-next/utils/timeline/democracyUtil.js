import styled from "styled-components";
import { getTimelineStatus } from "utils";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import SymbolBalance from "next-common/components/values/symbolBalance";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import AddressUser from "next-common/components/user/addressUser";

const DepositorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  > :not(:first-child) {
    margin-top: 4px;
  }
`;

function getTimelineData(args, method) {
  switch (method) {
    case "Proposed":
      return {
        Index: `#${args.index}`,
      };
    case "Tabled":
      return {
        "Referenda Index": `#${args.referendumIndex}`,
        Deposit: <SymbolBalance value={args.deposit} isVote />,
        Depositors: (
          <DepositorsWrapper>
            {(args.depositors || []).map((item, index) => (
              <AddressUser add={item} key={index} />
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
  type = detailPageCategory.DEMOCRACY_PROPOSAL,
) {
  return timeline.map((item) => ({
    time: formatTime(item.indexer.blockTime),
    indexer: item.indexer,
    status: getTimelineStatus(type, item.method ?? item.name, item.args),
    data: getTimelineData(item.args, item.method ?? item.name),
  }));
}

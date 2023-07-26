import { pretty_scroll_bar } from "next-common/styles/componentCss";
import styled from "styled-components";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import Pagination from "next-common/components/pagination";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Copyable from "next-common/components/copyable";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ClosedTag } from "next-common/components/tags/state/styled";
import DetailButton from "next-common/components/detailButton";
import { useState } from "react";

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  ${pretty_scroll_bar};
`;

const StyledList = styled(StyledListOrigin)`
  border: none;
  box-shadow: none;
  padding: 0;
`;

function parseStatus(status) {
  const statusName = Object.keys(status || {})[0];
  if (!statusName) return {};
  const { deposit = [] } = status[statusName];
  return {
    statusName,
    deposit,
  };
}

function Hash({ hash }) {
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(false);
  console.log({ showArgumentsDetail });

  return (
    <div className="flex">
      <div className="flex items-center w-[160px]">
        <Copyable copyText={hash}>
          <span className="inline-block w-[96px] truncate">{hash}</span>
        </Copyable>
      </div>
      <div className="flex items-centers mx-[16px]">
        <DetailButton onClick={() => setShowArgumentsDetail(true)} />
      </div>
    </div>
  );
}

function Deposit({ deposit }) {
  const { symbol, decimals } = useChainSettings();
  const [depositAddress, depositAmount] = deposit;
  return (
    <div className="flex flex-col">
      <User add={depositAddress} />
      <div className="ml-[28px] text-textSecondary text-[12px]">
        <ValueDisplay
          value={toPrecision(depositAmount, decimals)}
          symbol={symbol}
        />
      </div>
    </div>
  );
}

function Proposal({ proposal }) {
  const { section, method } = proposal;
  if (!section || !method) {
    return <span className="text-red500 font-medium">Unable to decode</span>;
  }
  return <span className="font-medium">{`${section}.${method}`}</span>;
}

export default function PreImagesTable({ data }) {
  const { columns } = useColumns([
    {
      name: "Hash",
      style: { textAlign: "left", width: "220px" },
    },
    {
      name: "Arguments",
      style: { textAlign: "left", minWidth: "360px" },
    },
    {
      name: "Depositor",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Length",
      style: { textAlign: "right", width: "128px", minWidth: "96px" },
    },
    {
      name: "Status",
      style: { textAlign: "right", width: "128px", minWidth: "128px" },
    },
  ]);

  const rows = (data?.items || []).map((item) => {
    const { statusName, deposit } = parseStatus(item.status);
    return [
      <Hash key="hash" hash={item.hash} />,
      item.proposal && <Proposal proposal={item.proposal} />,
      deposit && <Deposit key="deposit" deposit={deposit} />,
      item.len?.toLocaleString(),
      statusName && (
        <ClosedTag key="status" className="capitalize">
          {statusName}
        </ClosedTag>
      ),
    ];
  });

  return (
    <SecondaryCard>
      <ListWrapper>
        <StyledList
          columns={columns}
          rows={rows}
          noDataText="No current preimages"
        />
      </ListWrapper>
      <Pagination {...data} />
    </SecondaryCard>
  );
}

import { pretty_scroll_bar } from "next-common/styles/componentCss";
import styled from "styled-components";
import StyledListOrigin from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Copyable from "next-common/components/copyable";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ClosedTag } from "next-common/components/tags/state/styled";
import DetailButton from "next-common/components/detailButton";
import { useState } from "react";
import usePreimage from "hooks/usePreimage";

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
  const { who, amount } = deposit;

  return (
    <div className="flex flex-col">
      <User add={who} maxWidth={128} />
      <div className="ml-[28px] text-textSecondary text-[12px]">
        <ValueDisplay
          value={toPrecision(amount.toJSON(), decimals)}
          symbol={symbol}
        />
      </div>
    </div>
  );
}

function Proposal({ proposal }) {
  const { section, method } = proposal || {};
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

  const rows = (data || []).map((item) => {
    return {
      useData: () => {
        const preimage = usePreimage(item);
        if (!preimage) {
          return [];
        }

        return [
          <Hash key="hash" hash={item} />,
          <Proposal key="proposal" proposal={preimage.proposal} />,
          preimage.deposit && (
            <Deposit key="deposit" deposit={preimage.deposit} />
          ),
          preimage.proposalLength &&
            preimage.proposalLength?.toJSON()?.toLocaleString(),
          preimage.statusName && (
            <ClosedTag key="status" className="capitalize">
              {preimage.statusName}
            </ClosedTag>
          ),
        ];
      },
    };
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
    </SecondaryCard>
  );
}

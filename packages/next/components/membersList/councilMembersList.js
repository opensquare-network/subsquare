import styled, { withTheme } from "styled-components";
import {
  bigNumber2Locale,
  decimalPlaces,
  toPrecision,
} from "next-common/utils";
import { useState } from "react";
import PrimeAddressMark from "next-common/components/primeAddressMark";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useChainSettings } from "next-common/context/chain";
import MemberListTable from "next-common/components/memberListTable";
import AddressUser from "next-common/components/user/addressUser";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

  @media screen and (max-width: 392px) {
    .autohide {
      display: none;
    }
    th.clickable {
      color: var(--textSecondary);
      cursor: pointer;
      pointer-events: auto;
    }
  }
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BalanceWrapper = styled.span`
  color: var(--textPrimary);
`;
const SymbolWrapper = styled.span`
  color: var(--textTertiary);
`;

function Balance({ value }) {
  const node = useChainSettings();

  return (
    <div>
      <BalanceWrapper>
        {bigNumber2Locale(
          decimalPlaces(toPrecision(value ?? 0, node.decimals), 4),
        )}
      </BalanceWrapper>
      <SymbolWrapper style={{ color: "#9DA9BB", marginLeft: "8px" }}>
        {node.symbol}
      </SymbolWrapper>
    </div>
  );
}

function MembersList({
  category,
  items,
  prime,
  loading = false,
  hasElections = false,
}) {
  const [hideColumn, setHideColumn] = useState("votes");

  const columns = [{ name: "MEMBERS", style: { textAlign: "left" } }];

  if (hasElections) {
    columns.push(
      {
        name: "BACKING",
        style: { textAlign: "right" },
        className: hideColumn === "backing" ? "autohide" : "clickable",
        onClick: () => setHideColumn("backing"),
      },
      {
        name: "VOTES",
        style: { textAlign: "right" },
        className: hideColumn === "votes" ? "autohide" : "clickable",
        onClick: () => setHideColumn("votes"),
      },
    );
  }

  const rows = items.map((item) => {
    const row = [
      <Member key={item.address}>
        <AddressUser add={item.address} />
        {item.address === prime && <PrimeAddressMark />}
      </Member>,
    ];

    if (hasElections) {
      row.push(<Balance value={item.backing} />, item.votes ?? "--");
    }

    return row;
  });

  return (
    <Wrapper>
      <TitleContainer>{category}</TitleContainer>
      <MemberListTable columns={columns} rows={rows} loading={loading} />
    </Wrapper>
  );
}

export default withTheme(MembersList);

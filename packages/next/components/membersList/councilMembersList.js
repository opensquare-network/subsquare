import styled, { withTheme } from "styled-components";
import { toPrecision } from "next-common/utils";
import PrimeAddressMark from "next-common/components/primeAddressMark";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useChainSettings } from "next-common/context/chain";
import MemberListTable from "next-common/components/memberListTable";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";

const Member = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

function MembersList({
  category,
  items,
  prime,
  loading = false,
  hasElections = false,
}) {
  const chainSettings = useChainSettings();

  const columns = [
    {
      name: "Members",
      style: { textAlign: "left" },
    },
  ];

  if (hasElections) {
    columns.push(
      {
        name: "Backing",
        style: { width: 240, textAlign: "right" },
      },
      {
        name: "Votes",
        style: { width: 160, textAlign: "right" },
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
      row.push(
        <ValueDisplay
          value={toPrecision(item.backing, chainSettings.decimals)}
          symbol={chainSettings.symbol}
        />,
        item.votes ?? "--",
      );
    }

    return row;
  });

  return (
    <div className="">
      <TitleContainer>{category}</TitleContainer>
      <MemberListTable columns={columns} rows={rows} loading={loading} />
    </div>
  );
}

export default withTheme(MembersList);

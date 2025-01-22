import styled from "styled-components";
import React from "react";
import PrimeAddressMark from "../primeAddressMark";
import { TitleContainer } from "../styled/containers/titleContainer";
import MemberListTable from "../memberListTable";
import AddressUser from "../user/addressUser";
import { isSameAddress } from "next-common/utils";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function MembersList({
  category,
  items,
  prime,
  loading = false,
}) {
  const columns = [{ name: "MEMBERS", style: { textAlign: "left" } }];

  const rows = items.map((item) => [
    <Member key={item}>
      <AddressUser add={item} />
      {isSameAddress(item, prime) && <PrimeAddressMark />}
    </Member>,
  ]);

  return (
    <Wrapper>
      <TitleContainer>{category}</TitleContainer>
      <MemberListTable columns={columns} rows={rows} loading={loading} />
    </Wrapper>
  );
}

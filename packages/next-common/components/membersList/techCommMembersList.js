import styled from "styled-components";
import User from "../user";
import React from "react";
import PrimeAddressMark from "../primeAddressMark";
import { TitleContainer } from "../styled/containers/titleContainer";
import MemberListTable from "../memberListTable";

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
      <User add={item} fontSize={14} />
      {item === prime && <PrimeAddressMark />}
    </Member>,
  ]);

  return (
    <Wrapper>
      <TitleContainer>{category}</TitleContainer>
      <MemberListTable columns={columns} rows={rows} loading={loading} />
    </Wrapper>
  );
}

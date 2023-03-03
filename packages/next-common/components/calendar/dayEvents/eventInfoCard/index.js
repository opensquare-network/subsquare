import styled from "styled-components";
import Divider from "../../../styled/layout/divider";
import Title from "./title";
import Content from "./content";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  gap: 8px;

  background: ${(p) => p.theme.neutral};
  border: 1px solid ${(p) => p.theme.grey200Border};

  box-shadow: ${(p) => p.theme.shadow100};
  border-radius: 4px;
`;

export default function EventInfoCard({ event }) {
  const [isFolded, setIsFolded] = useState(false);

  if (!event) {
    return null;
  }

  return (
    <Wrapper>
      <Title event={event} isFolded={isFolded} setIsFolded={setIsFolded} />
      {!isFolded && (
        <>
          <Divider style={{ width: "100%" }} />
          <Content {...event} />
        </>
      )}
    </Wrapper>
  );
}

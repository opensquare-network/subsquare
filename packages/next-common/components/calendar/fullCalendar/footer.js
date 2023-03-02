import React from "react";
import styled from "styled-components";
import { flex, gap_x, justify_center, p_b } from "../../../styles/tailwindcss";
import FullCalendarCategory from "./category";

const Wrapper = styled.div`
  ${flex}
  ${justify_center}
  ${gap_x(16)}
  ${p_b(8)}
`;

const categories = ["OpenGov", "Democracy", "Treasury", "Collectives"];

export default function FullCalendarFooter() {
  return (
    <Wrapper>
      {categories.map((category) => (
        <FullCalendarCategory key={category} category={category} />
      ))}
    </Wrapper>
  );
}

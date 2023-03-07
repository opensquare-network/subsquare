import React, { useMemo } from "react";
import styled from "styled-components";
import { useMenuHasGov2 } from "../../../context/chain";
import {
  flex,
  gap_x,
  hidden,
  justify_center,
  p_b,
} from "../../../styles/tailwindcss";
import { smcss } from "../../../utils/responsive";
import FullCalendarCategory from "./category";
import {
  FULLCALENDAR_CATEGORY_COLLECTIVES,
  FULLCALENDAR_CATEGORY_DEMOCRACY,
  FULLCALENDAR_CATEGORY_OPEN_GOV,
  FULLCALENDAR_CATEGORY_TREASURY,
} from "./consts";

const Wrapper = styled.div`
  ${flex}
  ${justify_center}
  ${gap_x(16)}
  ${p_b(8)}

  ${smcss(hidden)}
`;

export default function FullCalendarFooter() {
  const hasGov2 = useMenuHasGov2();

  const categories = useMemo(
    () =>
      [
        hasGov2 && FULLCALENDAR_CATEGORY_OPEN_GOV,
        FULLCALENDAR_CATEGORY_DEMOCRACY,
        FULLCALENDAR_CATEGORY_TREASURY,
        FULLCALENDAR_CATEGORY_COLLECTIVES,
      ].filter(Boolean),
    [hasGov2],
  );

  return (
    <Wrapper>
      {categories.map((category) => (
        <FullCalendarCategory key={category} category={category} />
      ))}
    </Wrapper>
  );
}

import React, { useMemo } from "react";
import styled from "styled-components";
import { useChainSettings } from "../../../context/chain";
import { flex, gap_x, hidden, justify_center, p_b, } from "../../../styles/tailwindcss";
import { smcss } from "../../../utils/responsive";
import Tooltip from "../../tooltip";
import FullCalendarCategory from "./category";
import {
  FULLCALENDAR_CATEGORY_COLLECTIVES,
  FULLCALENDAR_CATEGORY_DEMOCRACY,
  FULLCALENDAR_CATEGORY_OPEN_GOV,
  FULLCALENDAR_CATEGORY_OTHERS,
  FULLCALENDAR_CATEGORY_PARACHAIN,
  FULLCALENDAR_CATEGORY_SCHEDULER,
  FULLCALENDAR_CATEGORY_SOCIETY,
  FULLCALENDAR_CATEGORY_STAKING,
  FULLCALENDAR_CATEGORY_TREASURY,
  FULLCALENDAR_CATEGORY_USER,
} from "./consts";

const Wrapper = styled.div`
  ${flex}
  ${justify_center}
  ${gap_x(16)}
  ${p_b(8)}

  ${smcss(hidden)}
  z-index: 4;
`;

const OthersCategory = styled.div`
  ${flex}
  gap: 4px;
`;

export default function FullCalendarFooter() {
  const { hasReferenda, hasFellowship } = useChainSettings();
  const hasGov2 = hasReferenda || hasFellowship;

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

  const othersTooltip = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <span>{FULLCALENDAR_CATEGORY_PARACHAIN}</span>
      <span>{FULLCALENDAR_CATEGORY_SCHEDULER}</span>
      <span>{FULLCALENDAR_CATEGORY_STAKING}</span>
      <span>{FULLCALENDAR_CATEGORY_SOCIETY}</span>
      <span>{FULLCALENDAR_CATEGORY_USER}</span>
    </div>
  );

  return (
    <Wrapper>
      {categories.map((category) => (
        <FullCalendarCategory key={category} category={category} />
      ))}
      <OthersCategory>
        <FullCalendarCategory category={FULLCALENDAR_CATEGORY_OTHERS} />
        <div>
          <Tooltip content={othersTooltip} />
        </div>
      </OthersCategory>
    </Wrapper>
  );
}

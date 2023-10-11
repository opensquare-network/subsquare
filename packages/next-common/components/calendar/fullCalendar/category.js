import React from "react";
import styled from "styled-components";
import { FULLCALENDAR_CATEGORY_COLORS } from "./consts";

const Dot = styled.span`
  width: 8px;
  height: 8px;
  background-color: ${(p) => p.color || "var(--textTertiary)"};
`;

export default function FullCalendarCategory({
  category,
  onlyDot = false,
  color,
}) {
  const categoryColor = color ?? FULLCALENDAR_CATEGORY_COLORS[category];

  return (
    <span className="inline-flex items-center">
      <Dot color={categoryColor} className="rounded-full" />
      {!onlyDot && category && (
        <span className="text12Medium text-textSecondary ml-2">{category}</span>
      )}
    </span>
  );
}

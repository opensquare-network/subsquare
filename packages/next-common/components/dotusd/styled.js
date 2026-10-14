import styled from "styled-components";
import StyledList from "next-common/components/styledList";

// StyledList renders a StyledTable card with a 6px radius, a step tighter than the
// SecondaryCard panels above it. Pin the tables to the panel radius so every section on the
// page reads as the same set of cards.
export const TableCard = styled(StyledList)`
  border-radius: 12px;
`;

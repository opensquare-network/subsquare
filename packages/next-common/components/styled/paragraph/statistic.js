import styled from "styled-components";

// used for voters' statistic. For example, tippers, motion voters. Shown as `x/y`.
const Statistics = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.textTertiary};
`;

export default Statistics;

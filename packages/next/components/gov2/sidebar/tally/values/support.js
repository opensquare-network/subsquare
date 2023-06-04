import ElectorateIcon from "next-common/assets/imgs/icons/electorate.svg";
import SymbolValue from "./symbolValue";
import { BorderedRow, Header } from "next-common/components/referenda/tally/styled";
import Percentage from "next-common/components/referenda/tally/support/percentage";
import styled from "styled-components";
import { p_14_medium } from "next-common/styles/componentCss";
import { m_l, text_tertiary } from "next-common/styles/tailwindcss";

const PercentageWrapper = styled.span`
  ${p_14_medium};
  ${text_tertiary};
  ${m_l(4)};
`;

export default function Support({ supportPerbill = 0, value = 0 }) {

  return (
    <BorderedRow>
      <Header>
        <ElectorateIcon />
        Support
        <PercentageWrapper>
          (<Percentage perbill={supportPerbill} />)
        </PercentageWrapper>
      </Header>
      <SymbolValue value={value} />
    </BorderedRow>
  );
}

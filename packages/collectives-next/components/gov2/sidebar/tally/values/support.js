import ElectorateIcon from "next-common/assets/imgs/icons/electorate.svg";
import SymbolValue from "./symbolValue";
import {
  BorderedRow,
  Header,
} from "next-common/components/referenda/tally/styled";
import Percentage from "next-common/components/referenda/tally/support/percentage";
import TitleSuffix from "next-common/components/titleSuffix";

export default function Support({ supportPerbill = 0, value = 0 }) {
  return (
    <BorderedRow>
      <Header>
        <ElectorateIcon />
        Support
        <TitleSuffix suffix={<Percentage perbill={supportPerbill} />} />
      </Header>
      <SymbolValue value={value} />
    </BorderedRow>
  );
}

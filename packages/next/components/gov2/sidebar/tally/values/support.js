import ElectorateIcon from "next-common/assets/imgs/icons/electorate.svg";
import SymbolValue from "./symbolValue";
import {
  BorderedRow,
  Header,
} from "next-common/components/referenda/tally/styled";
import Percentage from "next-common/components/referenda/tally/support/percentage";

export default function Support({ supportPerbill = 0, value = 0 }) {
  return (
    <BorderedRow>
      <Header>
        <ElectorateIcon />
        Support
        <span className="ml-1 text-textTertiary text14Medium">
          (<Percentage perbill={supportPerbill} />)
        </span>
      </Header>
      <SymbolValue value={value} />
    </BorderedRow>
  );
}

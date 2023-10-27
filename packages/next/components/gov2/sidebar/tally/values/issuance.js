import TurnoutIcon from "next-common/assets/imgs/icons/turnout.svg";
import SymbolValue from "./symbolValue";
import {
  Header,
  BorderedRow,
} from "next-common/components/referenda/tally/styled";

export default function Issuance({ issuance }) {
  return (
    <BorderedRow>
      <Header>
        <TurnoutIcon />
        Issuance
      </Header>
      <SymbolValue value={issuance} />
    </BorderedRow>
  );
}

import TurnoutIcon from "../../../../../public/imgs/icons/turnout.svg";
import SymbolValue from "./symbolValue";
import { Row, Header } from "next-common/components/referenda/tally/styled";

export default function Issuance({ issuance }) {
  return (
    <Row>
      <Header>
        <TurnoutIcon />
        Issuance
      </Header>
      <SymbolValue value={issuance} />
    </Row>
  );
}

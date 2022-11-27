import { Header, Row } from "./styled";
import TurnoutIcon from "../../../../../public/imgs/icons/turnout.svg";
import SymbolValue from "./symbolValue";

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

import TurnoutIcon from "../../../../../public/imgs/icons/turnout.svg";
import { Header, Row } from "./styled";
import { useTally } from "next-common/context/post/gov2/referendum";
import SymbolValue from "./symbolValue";

export default function Support() {
  const tally = useTally();

  return (
    <Row>
      <Header>
        <TurnoutIcon />
        Support
      </Header>
      <SymbolValue value={tally?.support} />
    </Row>
  );
}

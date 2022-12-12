import ElectorateIcon from "../../../../../public/imgs/icons/electorate.svg";
import { useTally } from "next-common/context/post/gov2/referendum";
import SymbolValue from "./symbolValue";
import { Row, Header } from "next-common/components/referenda/tally/styled";

export default function Support() {
  const tally = useTally();

  return (
    <Row>
      <Header>
        <ElectorateIcon />
        Support
      </Header>
      <SymbolValue value={tally?.support} />
    </Row>
  );
}

import ElectorateIcon from "../../../../../public/imgs/icons/electorate.svg";
import { BorderedRow, Header } from "./styled";
import { useTally } from "next-common/context/post/gov2/referendum";
import SymbolValue from "./symbolValue";

export default function Support() {
  const tally = useTally();

  return (
    <BorderedRow>
      <Header>
        <ElectorateIcon />
        Support
      </Header>
      <SymbolValue value={tally?.support} />
    </BorderedRow>
  );
}

import ElectorateIcon from "next-common/assets/imgs/icons/electorate.svg";
import { useTally } from "next-common/context/post/gov2/referendum";
import SymbolValue from "./symbolValue";
import {
  BorderedRow,
  Header,
} from "next-common/components/referenda/tally/styled";

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

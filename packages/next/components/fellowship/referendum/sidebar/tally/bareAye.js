import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import { useTally } from "next-common/context/post/gov2/referendum";
import ElectorateIcon from "next-common/assets/imgs/icons/electorate.svg";

export default function BareAye() {
  const tally = useTally();

  return (
    <BorderedRow>
      <Header>
        <ElectorateIcon />
        Bare Aye
      </Header>
      <Value>{tally.bareAyes}</Value>
    </BorderedRow>
  );
}

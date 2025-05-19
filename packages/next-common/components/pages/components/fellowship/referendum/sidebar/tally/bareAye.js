import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import ElectorateIcon from "next-common/assets/imgs/icons/electorate.svg";

export default function BareAye({ value = 0 }) {
  return (
    <BorderedRow>
      <Header>
        <ElectorateIcon />
        Bare Aye
      </Header>
      <Value>{value}</Value>
    </BorderedRow>
  );
}
